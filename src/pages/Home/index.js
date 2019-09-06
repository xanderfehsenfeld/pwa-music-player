import React, { Component, Fragment } from 'react';
import MediaButton from '../../components/MediaButton';
import { ReactComponent as Headphones } from '../../icons/headphones.svg';
import { ReactComponent as PlayButton } from '../../icons/play-arrow.svg';
import './style.scss';

class Home extends Component {
  componentDidMount() {
    requestAnimationFrame(() => {
      [...document.querySelector('.home').querySelectorAll('.hidden')].map((elmt) => elmt.classList.add('active'));
    });
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.active !== this.props.active;
  }

  render() {
    return (
      <Fragment>
        <h1 className="title hidden">React Music Player</h1>
        <Headphones className="icon hidden" width="100" fill="#ccc" />

        <MediaButton
          className="hidden"
          tabEnabled={this.props.active}
          name="button show playlist"
          active={true}
          onClick={this.props.onStartClick}
          icon={<PlayButton width={24} />}
        />

      </Fragment>
    );
  }
}

export default Home;
