/**
 * Backend for BenarID chrome extension. This script connects the
 * popup UI and badge UI to BenarID server through message passing.
 * The script also holds all the data state of the extension.
 */

const SIGNIN_URL = 'http://localhost:5000/auth/google'
const RETRIEVE_URL = 'http://localhost:5000/auth/retrieve'

const signInWindowProps = {
  url: SIGNIN_URL,
  height: 500,
  width: 600,
  type: 'popup',
}

let token

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
  switch(msg.type) {
    case 'SignIn':
      return initiateSignIn()
    case 'FetchRating':
      return fetchRating(msg.url, token)
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

function fetchUserData(token) {
  console.log('Fetching', token)
}

function fetchRating(url, token) {
  // TODO: Implement fetching rating.
  console.log('Fetching rating for ' + url + ' ' + token)
}
