import React, { PureComponent, Suspense, lazy } from 'react'
import { createBrowserHistory, History } from 'history'
import firebase from 'firebase/app'
import flatten from 'lodash/flatten'

import Home from '../pages/Home'
import percent from '../helpers/percent'
import Menu from '../components/Menu'
import Page from '../components/Page'
import Loader from '../components/Loader'
import Audio from '../helpers/audio'
import './style.scss'
import StatusBar from '../components/StatusBar'
import { getRegisteredServiceWorkers } from '../helpers/serviceWorkerCache'
import isBeat from '../pages/List/isBeat'
import { findIndex, compact } from 'lodash'

const List = lazy(() => import('../pages/List'))
const Detail = lazy(() => import('../pages/Detail'))
const Add = lazy(() => import('../pages/Add'))

interface IProps {
  audioContext: AudioContext
}

type IView = 'add' | 'about' | 'songs' | 'beats' | 'home' | '' | '/' | 'detail'

export interface IAppState {
  tracks: ITrack[]
  tracksInList: ITrack[]
  previousView: IView
  currentView: IView
  repeat: boolean
  changingTrack: boolean
  playlistLoaded?: boolean
  currentTime?: number
  track: CurrentTrack
  songsCached?: number
}

interface CurrentTrack {
  currentTime: number
  percentage: number
  paused: boolean
  played: boolean
  playing: boolean
  artwork_url: string
  index: number
  id: number
  artist: string
  title: string
}

type ITrack = CurrentTrack & {
  stream_url: string
  uri: string
  duration: number
  favoritings_count: number
  permalink_url: string
  downloaded: boolean
}

class App extends PureComponent<IProps, IAppState> {
  history: History<any>
  audio?: Audio
  constructor(props: IProps) {
    super(props)

    this.state = {
      tracks: [],
      tracksInList: [],
      previousView: '/',
      currentView: '',
      repeat: false,
      changingTrack: false,
      track: {
        title: 'test',
        artist: 'test',
        index: 1,
        id: 1,
        currentTime: 0,
        percentage: 0,
        paused: true,
        played: false,
        playing: false,
        artwork_url: '',
      },
    }
    this.history = createBrowserHistory()
  }

  componentDidMount() {
    this.history.listen((location) => {
      this.setState(() => {
        return { currentView: this.history.location.state.view || '/' }
      })

      if (
        ['beats', 'songs'].includes(location.state.view) &&
        !this.state.tracks.length
      ) {
        this.fetchPlayList()
      }
    })

    this.setupAudio()
    if (this.history.location.pathname.includes('beats')) {
      this.changeView('beats')
    } else if (this.history.location.pathname.includes('songs')) {
      this.changeView('songs')
    } else {
      this.history.push('/', { view: 'home' })
    }
  }

  onButtonClick = (button: IView) => {
    this.changeView(button)
  }

  fetchPlayList = async () => {
    const db = firebase.firestore()

    db.collection('rips')
      .orderBy('created')
      .onSnapshot(async (rips) => {
        const data = rips.docs.map((v) => v.data()) as {
          url: string
          plainTextName: string
          duration: number
          state: string
          albumArtwork: string
          artist: string
        }[]

        const tracks = data.map(
          (
            { url, plainTextName, duration, state, albumArtwork, artist },
            index,
          ) => {
            return Object.assign(
              {},
              {
                ...this.state.track,
                id: index,
                stream_url: url,
                uri: url,
                duration: duration * 1000,
                favoritings_count: 0,
                artist: artist || '',
                artwork_url: albumArtwork || '',
                title: plainTextName,
                permalink_url: url,
                index,
                downloaded: state === 'finished',
              },
            )
          },
        )

        this.setState({
          tracks,
          tracksInList: tracks.filter(({ title }) =>
            this.state.currentView === 'beats' ? isBeat(title) : !isBeat(title),
          ),
          playlistLoaded: true,
        })
        let songsCached = 0

        let cache: undefined | Cache
        let keys: undefined | string[]
        const serviceWorkerIsRegistered =
          (await getRegisteredServiceWorkers()).length > 0
        if ('caches' in window && serviceWorkerIsRegistered) {
          cache = await caches.open('dynamic-fetches')
          keys = (await cache.keys()).map((v) => v.url)
        }

        if (cache !== undefined && keys) {
          const notCached = compact(
            flatten(data.map(({ albumArtwork, url }) => [albumArtwork, url])),
          ).map((v) => encodeURI(v))

          notCached.forEach((url) => {
            if (keys && cache && !keys.includes(url)) {
              cache.add(url)
              if (url.includes('.mp3')) {
                songsCached++
              }
            }
          })
        }
        this.setState({ songsCached })
      })
  }

  changeView(view: IView) {
    if (this.state.currentView !== view) {
      this.history.push(`/${view}`, { view })

      if (view === 'beats' || view === 'songs') {
        this.setState({
          tracksInList: this.state.tracks.filter(({ title }) =>
            view === 'beats' ? isBeat(title) : !isBeat(title),
          ),
        })
      }
    }
  }

  setTrack(track: CurrentTrack) {
    this.setState({
      track,
      currentTime: 0,
      changingTrack: true,
    })
  }

  canChangeTrack() {
    return this.state.changingTrack === false
  }

  getNextTrack() {
    const { track, tracksInList } = this.state
    const indexOfTrack = findIndex(
      tracksInList,
      ({ title }) => title === track.title,
    )
    const nextTrack = tracksInList[indexOfTrack + 1] || tracksInList[0]

    return nextTrack ? { ...nextTrack } : undefined
  }

  getPreviousTrack() {
    const { track, tracksInList } = this.state
    const indexOfTrack = findIndex(
      tracksInList,
      ({ title }) => title === track.title,
    )
    const previousTrack = tracksInList[indexOfTrack - 1]
    return previousTrack ? { ...previousTrack } : undefined
  }

  changeTrack(track?: ITrack) {
    if (this.canChangeTrack() && track) {
      this.setTrack(track)
      this.onPlayClick(track)
    }
  }

  selectTrack = (id: number) => {
    return this.state.tracks.filter((track) => Number(id) === track.id)[0]
  }

  setupAudio = () => {
    this.timeupdate = this.timeupdate.bind(this)
    this.audioStop = this.audioStop.bind(this)

    this.audio = new Audio(
      document.querySelector('#audio'),
      this.props.audioContext,
    )
    this.audio.setup()
    this.audio.setTimerHandler(this.timeupdate)
    this.audio.setStopHandler(this.audioStop)
    this.audio.canplay(() => {
      this.setState(() => {
        return {
          changingTrack: false,
        }
      })
    })
  }

  audioStop() {
    this.setState({
      track: {
        ...this.state.track,
        currentTime: 0,
        percentage: 0,
        playing: false,
        played: false,
        paused: true,
      },
    })
  }

  timeupdate = (evt: { target: { currentTime: number; duration: any } }) => {
    const percentComplete =
      percent(evt.target.currentTime, evt.target.duration) / 100
    this.setState({
      track: {
        ...this.state.track,
        currentTime: evt.target.currentTime,
        percentage: percentComplete,
      },
    })
    if (percentComplete === 1) {
      this.changeTrack(this.getNextTrack())
    }
  }

  onListClick = (id: number) => {
    if (id !== this.state.track.id) {
      this.audio!.setAudioSource('')
    }

    const track = {
      ...this.selectTrack(id),
      currentTime: 0,
      percentage: 0,
      playing: this.state.track.id === id ? this.state.track.playing : false,
      played: this.state.track.id === id ? this.state.track.played : false,
      paused: this.state.track.id === id ? this.state.track.paused : true,
    }

    this.setState(() => {
      return { track }
    })

    this.changeView('detail')

    this.onPlayClick(track)
  }

  onPlayClick = (track: ITrack) => {
    if (!track.played) {
      this.audio!.setAudioSource(`${track.stream_url}`)
    }

    this.setState({
      track: {
        ...track,
        paused: false,
        playing: true,
        played: true,
      },
    })

    this.audio!.resume()
    this.audio!.play()
  }

  onPauseClick = (track: CurrentTrack) => {
    this.audio!.pause()

    this.setState(() => {
      return {
        track: {
          ...track,
          paused: true,
          playing: false,
        },
      }
    })
  }

  onBackClick = () => {
    if (['beats', 'songs'].includes(this.state.currentView)) {
      this.history.replace('/', { view: 'home' })
    } else {
      this.history.go(-1)
      this.setState({ currentView: this.history.location.state.view || '/' })
    }
  }

  onAboutClick = () => {
    this.changeView('about')
  }
  onAddClick = () => {
    this.changeView('add')
  }
  onPlayNext = () => {
    this.changeTrack(this.getNextTrack())
  }

  onPlayPrev = () => {
    this.changeTrack(this.getPreviousTrack())
  }

  onRepeatClick = () => {
    const repeat = !this.state.repeat

    this.setState(() => {
      return { repeat }
    })

    this.audio!.repeat(repeat)
  }

  render() {
    const { songsCached, tracksInList } = this.state
    return (
      <main className="app">
        <audio id="audio" crossOrigin="anonymous"></audio>
        <div className="shell">
          <Menu
            history={this.history}
            activeView={this.state.currentView}
            onBackClick={this.onBackClick}
            onAboutClick={this.onAboutClick}
            onCloseClick={this.onBackClick}
            onAddClick={this.onAddClick}
          />
          <div className="page-wrapper">
            <Page className="home" active={this.state.currentView === 'home'}>
              <Home
                active={this.state.currentView === 'home'}
                onBeatsClick={() => this.onButtonClick('beats')}
                onSongsClick={() => this.onButtonClick('songs')}
              />
            </Page>
            <Suspense fallback={<Loader />}>
              {['beats', 'songs'].includes(this.state.currentView) ? (
                <List
                  active={['beats', 'songs'].includes(this.state.currentView)}
                  isBeats={this.state.currentView === 'beats'}
                  track={this.state.track}
                  tracks={tracksInList}
                  onClick={this.onListClick}
                />
              ) : null}
              {this.state.currentView === 'detail' ? (
                <Page
                  className="detail"
                  active={this.state.currentView === 'detail'}
                >
                  <Detail
                    track={this.state.track}
                    repeat={this.state.repeat}
                    onRepeatClick={this.onRepeatClick}
                    onPlayClick={this.onPlayClick}
                    onPlayNext={this.onPlayNext}
                    onPlayPrev={this.onPlayPrev}
                    onPauseClick={this.onPauseClick}
                    onScrub={this.audio && this.audio.setPercent}
                  />
                </Page>
              ) : null}
              {this.state.currentView === 'add' ? (
                <Page className="add" active={this.state.currentView === 'add'}>
                  <Add
                    switchToListView={() =>
                      this.history.push(`/list`, { view: 'beats' })
                    }
                  />
                </Page>
              ) : null}
            </Suspense>
          </div>
          {songsCached ? <StatusBar songsCached={songsCached} /> : null}
        </div>
      </main>
    )
  }
}

export default App
