/**
 * A NodeJS module for interfacing with Feedly.
 * @module node-feedly
 * @version 0.1
 * @author Marcus Smith
 * @description A NodeJS module for interacting with Feedly.
 * @param {Object} config : A valid configuration.
 */

var qs = require('querystring')
	, OAuth2 = require('OAuth').OAuth2;


function Feedly(config) {
	this.baseUrl = config.feedly.baseUrl;
  this.authenticateUrl = config.feedly.authenticateUrl;
  this.clientId = config.secrets.clientId;
  this.redirectUrl = config.secrets.redirectUrl;
  this.scope = config.feedly.scope;

  this.oauth = new OAuth2(
		config.secrets.clientId,
		config.secrets.clientSecret,
		config.feedly.baseUrl,
		config.feedly.authenticateUrl,
		config.feedly.accessTokenUrl,
		null
	);

  this.oauth.useAuthorizationHeaderforGET(true);
	this.oauth.setAuthMethod("OAuth");
}


/**
 * Build and return an appropriate Authorization URL where the user can grant permission to the application.
 * @memberof module:node-feedly
 */
Feedly.prototype.getAuthClientRedirectUrl = function() {
  return this.baseUrl + this.authenticateUrl + '?client_id=' +
    this.clientId + '&response_type=code&redirect_uri=' +
    this.redirectUrl + '&scope=' +
    this.scope;
}


/**
 * Exchange a user authorization code for an access token.
 * AccessToken: no required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {String} code : the code returned from an authorized call to Feedly
 * @param {Function} callback: callback, function({Object} data)
 * @see http://developer.feedly.com/v3/profile/
**/
Feedly.prototype.getAccessToken = function(code, params, callback) {

	var params= params || {};
	params.grant_type = 'authorization_code';
	params.redirect_uri = this.redirectUrl;

	 this.oauth.getOAuthAccessToken(code, params,	
	 	function(err, access_token, refresh_token, results) {
	 		if(err) callback(err, undefined);
	 		try {
	 			console.log(results);
	 			callback(null, access_token)
	 		} catch(e) {
	 			callback(e);
	 		}
	 });

}


/**
 * Retrieve profile information.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/profile/
**/
Feedly.prototype.getProfile = function (params, error, success) {
	var path = 'profile'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success)
}


/**
 * Retrieve preferences.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/preferences/
**/
Feedly.prototype.getPreferences = function (params, error, success) {
	var path = 'preferences'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success)
}


/**
 * Retrieve Categories.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/categories/
**/
Feedly.prototype.getCategories = function (params, error, success) {
	var path = 'categories'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success)
}


/**
 * Retrieve Subscriptons.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/subscriptions/
**/
Feedly.prototype.getSubscriptions = function (params, error, success) {
	var path = 'subscriptions'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


/**
 * Retrieve Topics.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/subscriptions/
**/
Feedly.prototype.getTopics = function (params, error, success) {
	var path = 'topics'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


/**
 * Retrieve Tags.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/subscriptions/
**/
Feedly.prototype.getTags = function (params, error, success) {
	var path = 'tags'
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


/**
 * Retrieve Feed by ID.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/subscriptions/
**/
Feedly.prototype.getFeed = function (params, error, success) {
	var path = 'feed/' + params.feedId;
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


/**
 * Retrieve a list of Entry IDs by Stream ID.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/streams/
**/
Feedly.prototype.getStreamIds = function (params, error, success) {
	console.log(encodeURIComponent(params.streamId));
	var path = 'streams/' + encodeURIComponent(params.streamId) + '/ids';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


 /**
 * Retrieve a list of Feedly Entries by Stream ID.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/streams/
**/
Feedly.prototype.getStreamContents = function (params, error, success) {
	console.log(encodeURIComponent(params.streamId));
	var path = 'streams/' + encodeURIComponent(params.streamId) + '/contents';
	var url = this.baseUrl + path;
	this.doRequest(url, error, success);
}


 /**
 * Retrieve a Feedly Entry by ID.
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {Object} params : params
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/streams/
**/
Feedly.prototype.getEntry = function (params, error, success) {
	var path = 'entries/' + params.entryId;
	var url = this.baseUrl + path;
	this.doRequest(url, error, success)
}



 /**
 * Perform a request against the Feedly API
 * AccessToken: required
 * @memberof module:node-feedly
 * @param {String} url : Feedly API Url to call
 * @param {Function} error : error callback
 * @param {Function} success: success callback with results, function({Object} data)
 * @see http://developer.feedly.com/v3/streams/
**/
Feedly.prototype.doRequest = function (url, error, success) {
	this.oauth.get(url, this.accessToken, function (err, body, response) {
		if (!err && response.statusCode == 200) {
			success(body);
		} else {
			error(err, response, body);
		}
	})
}


if (!(typeof exports === 'undefined')) {
    exports.Feedly = Feedly;
}