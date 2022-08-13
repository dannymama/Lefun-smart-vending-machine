import Cookies from 'js-cookie'
// import Fingerprint2 from 'fingerprintjs2'

const TokenKey = 'Admin-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, {
    expires: 30
  })
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// export function getBrowserFingerprint () {
//   return new Promise(function (resolve) {
//     if (window.requestIdleCallback) {
//       requestIdleCallback(async function () {
//         let components = await Fingerprint2.getPromise()
//         let values = await components.map(function (component) {
//           return component.value
//         })
//         let murmur = await Fingerprint2.x64hash128(values.join(), 31)
//         resolve(murmur)
//       })
//     } else {
//       setTimeout(async function () {
//         let components = await Fingerprint2.getPromise()
//         let values = await components.map(function (component) {
//           return component.value
//         })
//         let murmur = await Fingerprint2.x64hash128(values.join(), 31)
//         resolve(murmur)
//       }, 500)
//     }
//   })
// }
