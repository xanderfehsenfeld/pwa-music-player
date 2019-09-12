import React, { Component, Fragment } from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

import { ReactComponent as Github } from '../../icons/github.svg'
import { ReactComponent as Headphones } from '../../icons/headphones.svg'
import { ReactComponent as PlayButton } from '../../icons/play-arrow.svg'
import './style.scss'
import { apiKey, databaseURL, projectId } from '../../helpers/environment'
import GradientButton from '../../components/GradientButton'

class Home extends Component {
  componentDidMount = async () => {
    requestAnimationFrame(() => {
      ;[...document.querySelector('.home').querySelectorAll('.hidden')].map(
        (elmt) => elmt.classList.add('active'),
      )
    })

    firebase.initializeApp({
      apiKey,
      databaseURL,
      projectId,
      authDomain: 'music-hosting-service.firebaseapp.com',
    })

    firebase
      .auth()
      .signInAnonymously()
      .catch(function(error) {
        console.log(error)
        console.log('there was an error')
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

        <div
          style={{
            width: 200,
            height: '40%',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          <GradientButton
            onClick={this.props.onStartClick}
            name="button show playlist"
            disabled={false}
          >
            {`Beats `}
            <PlayButton style={{ marginLeft: 10 }} width={15} />
          </GradientButton>
        </div>
        <footer className="footer">
          <a
            href="https://github.com/xanderfehsenfeld/pwa-music-player"
            aria-label="Github repository"
            tabIndex={this.props.active ? '0' : '-1'}
            target="_blank"
            rel="noopener noreferrer"
            className="github project"
          >
            {' '}
            <Github fill="#b9b9b9" />
          </a>
          <span>hosted on firebase</span>{' '}
        </footer>
      </Fragment>
    )
  }
}

export default Home
