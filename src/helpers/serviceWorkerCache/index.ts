export const getRegisteredServiceWorkers = async () =>
  await navigator.serviceWorker.getRegistrations()

export const getCache = async () =>
  'caches' in window ? await caches.open('dynamic-fetches') : undefined
