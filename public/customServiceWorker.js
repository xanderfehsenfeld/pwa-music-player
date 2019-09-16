/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts('/service-worker.js')

self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    event.respondWith(
      caches.match(event.request).then(function(matchResponse) {
        return (
          matchResponse ||
          fetch(event.request).then(function(fetchResponse) {
            return caches.open('dynamic-fetches').then(function(cache) {
              cache.put(event.request, fetchResponse.clone())
              return fetchResponse
            })
          })
        )
      }),
    )
  } else {
    return fetch(event.request).then(function(fetchResponse) {
      return fetchResponse
    })
  }
})

self.skipWaiting()
