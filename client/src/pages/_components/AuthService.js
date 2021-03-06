import decode from 'jwt-decode';

class AuthService {
  // Initializing important variables
  // constructor(domain) {
  //     this.domain = domain || 'http://localhost:5000' // API server domain
  //     this.fetch = this.fetch.bind(this) // React binding stuff
  //     this.login = this.login.bind(this)
  //     this.getProfile = this.getProfile.bind(this)
  // }

  login = (apiKey, email, password) => {
      // Get a token from api server using the fetch api
      // A mon futur moi: possible CORS ici en prod (mettre domain dans l'url de fetch)
      return this.fetch('/vibes/api/login', {
          method: 'POST',
          body: JSON.stringify({
              apiKey,
              email,
              password
          })
      }).then(res => {
          this.setToken(res.userToken, res.userId, res.role) // Setting the token in localStorage
          return Promise.resolve(res)
      })
  }

  loggedIn = () => {
      // Checks if there is a saved token and it's still valid
      const token = this.getToken() // GEtting token from localstorage
      return !!token && !this.isTokenExpired(token) // handwaiving here
  }

  isTokenExpired = (token) => {
      try {
          const decoded = decode(token);
          if (decoded.exp < Date.now() / 1000) { // Checking if token is expired. N
              return true;
          }
          else
              return false;
      }
      catch (err) {
          return false;
      }
  }

  setToken = (userToken, userId, userRole) => {
      // Saves user token to localStorage
      localStorage.setItem('userToken', userToken)
      localStorage.setItem('userId', userId)
      localStorage.setItem('userRole', userRole)
  }

  getToken = () => {
      // Retrieves the user token from localStorage
      return localStorage.getItem('userToken')
  }
  getUserIdToken = () => {
      // Retrieves the userId token from localStorage
      return localStorage.getItem('userId')
  }
  getUserRole = () => {
      // Retrieves the userId token from localStorage
      return localStorage.getItem('userRole')
  }
  logout = () => {
      // Clear user token and profile data from localStorage
      localStorage.removeItem('userToken')
      localStorage.removeItem('userId')
      localStorage.removeItem('userRole')
  }

  getProfile = () => {
      // Using jwt-decode npm package to decode the token
      return decode(this.getToken())
  }

  getUserProfile = () => {
    return this.getUserIdToken()
  }

  fetch = (url, options) => {
      // performs api calls sending the required authentication headers
      const headers = {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      }

      // Setting Authorization header
      // Authorization: Bearer xxxxxxx.xxxxxxxx.xxxxxx
      if (this.loggedIn()) {
          headers['Authorization'] = 'Bearer ' + this.getToken()
      }

      return fetch(url, {
          headers,
          ...options
      })
          .then(this._checkStatus)
          .then(response => response.json())
  }

  _checkStatus = (response) => {
      // raises an error in case response status is not a success
      if (response.status >= 200 && response.status < 300) { // Success status lies between 200 to 300
          return response
      } else {
          var error = new Error(response.statusText)
          error.response = response
          throw error
      }
  }
}

export default AuthService
