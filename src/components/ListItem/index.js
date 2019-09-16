import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ProgressBar from '../ProgressBar'
import albumThumbNail from '../../data/album-thumbnail.png'
import './style.scss'
import Skeleton from '@material-ui/lab/Skeleton'
import CheckCircle from '@material-ui/icons/CheckCircle'

class ListItem extends Component {
  shouldComponentUpdate(prevProps) {
    if (prevProps.selectedTrack.id === this.props.track.id) {
      return (
        prevProps.selectedTrack.percentage !==
        this.props.selectedTrack.percentage
      )
    }

    return (
      prevProps.active !== this.props.active ||
      prevProps.selectedTrack.title !== this.props.selectedTrack.title
    )
  }

  render() {
    const { id, percentage, playing } = this.props.selectedTrack
    const { downloaded } = this.props
    const trackIsPlaying = id === this.props.track.id && playing
    const Track = (
      <li className="row">
        <button
          disabled={!downloaded}
          className={`${trackIsPlaying ? 'btn playing' : 'btn'} ${
            downloaded ? '' : 'disabled'
          }`}
          tabIndex={this.props.active ? '0' : '-1'}
          onClick={this.props.onClick}
          data-id={this.props.track.id}
        >
          <div className="album">
            <img
              className="album__cover"
              width="50"
              height="50"
              src={this.props.track.artwork_url || albumThumbNail}
              alt={`Album artwork from track ${this.props.track.title}.`}
            />
          </div>
          <div className="info">
            <h2 className="info__track">{this.props.track.title}</h2>
            <span className="info__artist">
              {downloaded ? this.props.track.artist : 'downloading...'}
            </span>

            <div className="controls">
              <ProgressBar
                percent={id === this.props.track.id ? percentage : 0}
              />
            </div>
          </div>
        </button>
      </li>
    )

    return downloaded ? (
      Track
    ) : (
      <Skeleton variant="rect" width={'100%'} height={80} ena>
        {Track}
      </Skeleton>
    )
  }
}

ListItem.propTypes = {
  active: PropTypes.bool,
  selectedTrack: PropTypes.shape({
    id: PropTypes.number,
    percentage: PropTypes.number,
    title: PropTypes.string,
    playing: PropTypes.bool,
  }),
  track: PropTypes.shape({
    id: PropTypes.number.isRequired,
    artwork_url: PropTypes.string,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
  }),
  onClick: PropTypes.func.isRequired,
  downloaded: PropTypes.bool.isRequired,
}

export default ListItem
