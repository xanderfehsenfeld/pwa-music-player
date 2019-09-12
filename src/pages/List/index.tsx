import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'
import ListItem from '../../components/ListItem'
import './style.scss'
import isBeat from './isBeat'

interface IProps {
  track: {
    id: number
    artwork_url: string
    title: string
    artist: string
  }
  tracks: any[]
  onClick: (evt: any) => void
  active: boolean
  isBeats: boolean
}
class List extends PureComponent<IProps> {
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
      <Fragment>
        <ul className="track-list">
          {this.props.tracks
            .filter(({ title }) =>
              this.props.isBeats ? isBeat(title) : !isBeat(title),
            )
            .map((track) => {
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
      </Fragment>
    )
  }
}

export default List
