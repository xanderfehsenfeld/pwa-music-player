import React, { Component, Fragment } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'

import MediaButton from '../../components/MediaButton'
import { ReactComponent as Headphones } from '../../icons/headphones.svg'
import { ReactComponent as PlayButton } from '../../icons/play-arrow.svg'
import './style.scss'

class Home extends Component {
  componentDidMount = async () => {
    requestAnimationFrame(() => {
      ;[...document.querySelector('.home').querySelectorAll('.hidden')].map(
        (elmt) => elmt.classList.add('active'),
      )
    })

    firebase.initializeApp({
      apiKey: 'AIzaSyC7QbUsmT2VLsAJKN_PjQeY7BBjYRC9OXc',
      authDomain: 'music-hosting-service.firebaseapp.com',
      databaseURL: 'https://music-hosting-service.firebaseio.com',
      projectId: 'music-hosting-service',
      storageBucket: 'music-hosting-service.appspot.com',
      messagingSenderId: '638892593384',
      appId: '1:638892593384:web:4b62f60fa99dda8760395d',
    })
  }

  shouldComponentUpdate(prevProps) {
    return prevProps.active !== this.props.active
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
    )
  }
}

export default Home
