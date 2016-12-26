/**
 * Backend for BenarID chrome extension. This script connects the
 * popup UI and badge UI to BenarID server through message passing.
 * The script also holds all the data state of the extension.
 */

const HOST = 'http://localhost:4000'
const SIGNIN_URL = `${HOST}/auth/google`
const RETRIEVE_URL = `${HOST}/auth/retrieve`
const PROCESS_URL = `${HOST}/api/process`
const ME_URL = `${HOST}/api/me`
const STATS_URL = `${HOST}/api/stats`

const signInWindowProps = {
  url: SIGNIN_URL,
  height: 500,
  width: 600,
  type: 'popup',
}

let token

/**
 * Get token from storage.
 */
chrome.storage.sync.get('token', (obj) => {
  token = obj.token
  if (token) {
    fetchUserData(token)
  }
})

/**
 * Listens to messages.
 */
chrome.runtime.onMessage.addListener((msg, sender) => {
  console.log(`Received ${msg.type} message.`)
  switch(msg.type) {
    case 'SignIn':
      return initiateSignIn()
    case 'FetchRating':
      return fetchRating(sender, token)
  }
})

function initiateSignIn() {
  chrome.windows.create(signInWindowProps, (window) => {
    chrome.tabs.onUpdated.addListener(checkSignInSuccess)

    function checkSignInSuccess() {
      if (token) return false
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach((tab) => {
          if (tab.url.indexOf(RETRIEVE_URL) !== -1) {
            token = tab.url.split('#')[1].split('=')[1]
            chrome.tabs.remove(tab.id)
            chrome.storage.sync.set({ token }, () => {
              fetchUserData(token)
            })
          }
        })
      })
    }
  })
}

function logout() {
  chrome.storage.sync.remove('token', () => {
    // TODO: broadcast
    token = null
  })
}

function fetchUserData(token) {
  fetch('GET', ME_URL, token)
    .then((response) => {
      console.log(response)
    })
    .catch((error) => {
      // Invalid or expired token, force logout
      logout()
    })
}

function fetchRating(sender, token) {
  const data = new FormData()
  data.append('url', sender.url)

  fetch('POST', PROCESS_URL, token, data)
    .then((response) => {
      chrome.tabs.sendMessage(sender.tab.id, { type: 'FetchRatingSuccess', payload: response })
    })
    .catch((error) => {
      console.log('Error', error)
    })
}

/**
 * Helper function for making HTTP requests.
 */
function fetch(method, url, token, data) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open(method, url, true)

    if (token) {
      xhr.setRequestHeader('authorization', `Bearer ${token}`)
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        xhr.status === 200 ?
          resolve(JSON.parse(xhr.responseText)) :
          reject(JSON.parse(xhr.responseText))
      }
    }

    xhr.send(data)
  })
}
