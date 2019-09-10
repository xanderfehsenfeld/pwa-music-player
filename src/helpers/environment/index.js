if (!process.env.REACT_APP_FIREBASE_API_KEY) {
  throw 'Missing process.env.REACT_APP_FIREBASE_API_KEY!'
}

export const apiKey = process.env.REACT_APP_FIREBASE_API_KEY

if (!process.env.REACT_APP_FIREBASE_DATABASE_URL) {
  throw 'Missing process.env.REACT_APP_FIREBASE_DATABASE_URL!'
}
export const databaseURL = process.env.REACT_APP_FIREBASE_DATABASE_URL

if (!process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  throw 'Missing process.env.REACT_APP_FIREBASE_PROJECT_ID!'
}
export const projectId = process.env.REACT_APP_FIREBASE_PROJECT_ID
