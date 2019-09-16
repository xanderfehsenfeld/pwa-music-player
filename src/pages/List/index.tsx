import React, { Component } from 'react'
import ListItem from '../../components/ListItem'
import './style.scss'
import isBeat from './isBeat'
import { IAppState } from '../../app'
import Page from '../../components/Page'

type IProps = {
  track: Pick<IAppState['track'], 'id' | 'artwork_url' | 'artist' | 'title'>
  tracks: IAppState['tracks']
  onClick: (evt: any) => void
  active: boolean
  isBeats: boolean
}
interface IState {
  savedKeys?: string[]
}
class List extends Component<IProps, IState> {
  state: IState = {}
  constructor(props: IProps) {
    super(props)

    this.onClick = this.onClick.bind(this)
  }

  onClick(evt: any) {
    const id = Number(evt.currentTarget.attributes['data-id'].value)

    this.props.onClick(id)
  }

  render() {
    return (
      <Page className={isBeat ? 'beats' : 'songs'} active={this.props.active}>
        <ul className="track-list">
          {this.props.tracks.map((track) => {
            return (
              <ListItem
                key={JSON.stringify(track)}
                active={this.props.active}
                selectedTrack={this.props.track}
                onClick={this.onClick}
                track={track}
                downloaded={track.downloaded}
              />
            )
          })}
        </ul>
      </Page>
    )
  }
}

export default List
