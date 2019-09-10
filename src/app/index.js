import React, { PureComponent, Suspense, lazy } from 'react'
import { createBrowserHistory } from 'history'
import firebase from 'firebase/app'

import Home from '../pages/Home'
import percent from '../helpers/percent'
import Menu from '../components/Menu'
import Page from '../components/Page'
import Loader from '../components/Loader'
import Audio from '../helpers/audio'
import { initialState } from '../data'
import './style.scss'

const List = lazy(() => import('../pages/List'))
const About = lazy(() => import('../pages/About'))
const Detail = lazy(() => import('../pages/Detail'))
const Add = lazy(() => import('../pages/Add'))

class App extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      ...initialState,
    }

    this.history = createBrowserHistory()
  }

  componentDidMount() {
    this.history.listen((location) => {
      this.setState(() => {
        return { currentView: this.history.location.state.view || '/' }
      })

      if (location.state.view === 'list' && !this.state.tracks[0].id) {
        this.fetchPlayList()
      }
    })

    this.setupAudio()
    if (this.history.location.pathname.includes('list')) {
      this.history.push('/', { view: 'home' })
      this.changeView('list')
    } else {
      this.history.push('/', { view: 'home' })
    }
  }

  onStartClick = () => {
    this.changeView('list')
  }

  fetchPlayList = async () => {
    const db = firebase.firestore()

    db.collection('rips').onSnapshot((rips) => {
      const data = rips.docs.map((v) => v.data())

      this.updateState(data)
    })
  }

  updateState(tracks) {
    const updatedState = {
      tracks: tracks.map(
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
      ),
      playlistLoaded: true,
    }

    this.setState(updatedState)
  }

  changeView(view) {
    this.history.push(`/${view}`, { view })
  }

  setTrack(track) {
    this.setState(() => {
      return {
        track,
        currentTime: 0,
        paused: true,
        played: false,
        playing: false,
        changingTrack: true,
      }
    })
  }

  canChangeTrack() {
    return this.state.changingTrack === false
  }

  getNextTrack() {
    const nextTrack = this.state.tracks[this.state.track.index + 1]

    return nextTrack ? { ...nextTrack } : null
  }

  getPreviousTrack() {
    const prevTrack = this.state.tracks[this.state.track.index - 1]

    return prevTrack ? { ...prevTrack } : null
  }

  changeTrack(track) {
    if (this.canChangeTrack() && track) {
      this.setTrack(track)
      this.onPlayClick(track)
    }
  }

  selectTrack = (id) => {
    return this.state.tracks.filter((track) => Number(id) === track.id)[0]
  }

  setupAudio() {
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

  timeupdate = (evt) => {
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

  onListClick = (id) => {
    if (id !== this.state.track.id) {
      this.audio.setAudioSource('')
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

  onPlayClick = (track) => {
    if (!track.played) {
      this.audio.setAudioSource(
        `${track.stream_url}?client_id=${process.env.REACT_APP_SOUNDCLOUD_APP_CLIENT_ID}`,
      )
    }

    this.setState(() => {
      return {
        track: {
          ...track,
          paused: false,
          playing: true,
          played: true,
        },
      }
    })

    this.audio.resume()
    this.audio.play()
  }

  onPauseClick = (track) => {
    this.audio.pause()

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
    this.history.go(-1)

    this.setState(() => {
      return { currentView: this.history.location.state.view || '/' }
    })
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

    this.audio.repeat(repeat)
  }

  render() {
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
              <Home onStartClick={this.onStartClick} />
            </Page>
            <Suspense fallback={<Loader />}>
              <Page className="list" active={this.state.currentView === 'list'}>
                <List
                  track={this.state.track}
                  tracks={this.state.tracks}
                  onClick={this.onListClick}
                />
              </Page>
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
              <Page className="add" active={this.state.currentView === 'add'}>
                <Add
                  switchToListView={() =>
                    this.history.push(`/list`, { view: 'list' })
                  }
                />
              </Page>
              <Page
                className="about"
                active={this.state.currentView === 'about'}
              >
                <About />
              </Page>
            </Suspense>
          </div>
        </div>
      </main>
    )
  }
}

export default App
