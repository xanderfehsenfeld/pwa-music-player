import React from 'react'
import { hydrate, render } from 'react-dom'
import App from './app'
import * as serviceWorker from './registerServiceWorker'

window.AudioContext = window.AudioContext || window.webkitAudioContext

if (window.AudioContext) {
  window.audioContext = new window.AudioContext()
}
const rootElement = document.getElementById('root')

if (rootElement.hasChildNodes()) {
  hydrate(<App audioContext={window.audioContext} />, rootElement)
} else {
  render(<App audioContext={window.audioContext} />, rootElement)
}

if (navigator.userAgent !== 'ReactSnap') {
  serviceWorker.register()
}
