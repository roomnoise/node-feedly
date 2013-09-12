// copy this file to config.js and edit the values below 
module.exports = {
  'feedly' : {
    'baseUrl' : 'http://cloud.feedly.com/v3/',
    'accessTokenUrl' : 'auth/token',
    'authenticateUrl' : 'auth/auth',
    'apiUrl' : 'http://developer.feedly.com/',
    'scope' : 'https://cloud.feedly.com/subscriptions'
  },
  'secrets' : {
    'responseType' : 'code',
    'clientId' : 'YOUR_ID',
    'clientSecret' : 'YOUR_SECRET',
    'redirectUrl' : 'http://localhost' // This should also be set in your OAuth profile.
  }
};