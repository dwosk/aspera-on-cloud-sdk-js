import { AsperaOnCloudOptions } from './aspera-on-cloud';
import axios, { AxiosPromise, AxiosRequestConfig } from 'axios';
import { getServerUrl, isBrowser } from './utils';

let jwt: any;
if (!isBrowser()) {
  jwt = require('njwt');
}

/**
 * @class AsperaOnCloudAuth
 * @classdesc The class that retrieves and manages the Aspera On Cloud API access tokens.
 * @arg {Object} options
 * @arg {String} [options.accessToken] - Access token used to authenticate to the Aspera on Cloud API.
 * @arg {String} [options.clientId] - The client id of your app in the Aspera on Cloud Admin app.
 * @arg {String} [options.clientSecret] - The client secret of your app in the Aspera on Cloud Admin app.
 * @arg {String} [options.org] - The organization that your app belongs to.
 * @arg {String} [options.redirect_uri] - The redirect uri of your app specified in the Aspera on Cloud Admin app.
 */
export class AsperaOnCloudAuth {
  accessToken?;
  axiosInstance;
  basePath;
  clientId?;
  clientSecret?;
  org?;
  redirectUri?;

  constructor(options: AsperaOnCloudOptions) {
    options = options || {};

    if (options.accessToken) {
      this.accessToken = options.accessToken;
      this.setAuthorizationHeader(this.accessToken);
    }

    this.basePath = getServerUrl(options.apiServer);
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.org = options.org;
    this.redirectUri = options.redirectUri;

    this.axiosInstance = axios.create({ baseURL: this.basePath });

    this.axiosInstance.interceptors.request.use(config => {
      // TODO: check if user is authenticated
      return config;
    });
  }

  /**
   * Get the access token used to authenticate to the Aspera On Cloud API.
   * @returns {String} Access token
   */
  getAccessToken() {
    return this.accessToken;
  }

  /**
   *
   * @arg {String} accessToken - Set the access token used to authenticate to the Aspera On Cloud API.
   * @returns {void}
   */
  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    this.setAuthorizationHeader(accessToken);
  }

  /**
   * Get the axios instance used by the AsperaOnCloudAuth class.
   * @returns {Function} Axios instance
   */
  getAxios() {
    return this.axiosInstance;
  }

  /**
   * Get the base path used for Aspera On Cloud API requests.
   * @returns {String} Base path for API requests
   */
  getBasePath() {
    return this.basePath;
  }

  /**
   * Get the client id for the API integration.
   * @returns {String} Client id
   */
  getClientId() {
    return this.clientId;
  }

  /**
   * Get the client secret for the API integration.
   * @returns {String} Client secret
   */
  getClientSecret() {
    return this.clientSecret;
  }

  /**
   * Get the Aspera On Cloud organization.
   * @returns {String} Org
   */
  getOrg() {
    return this.org;
  }

  /**
   * Get the redirect uri used by the API integration.
   * @returns {String} Redirect uri
   */
  getRedirectUri() {
    return this.redirectUri;
  }

  /**
   * Get the OAuth2 URL used for Aspera on Cloud API authentication
   * @arg {String} state - State to be returned in the redirect URI.
   * @arg {Array} scope - The granted access to be given to the access token.
   * @returns {String} - The URL to be used for Aspera On Cloud API authentication.
   */
  getOauthUrl(state?: string, scope: string[] = ['user:all'], responseType = 'code') {
    if (!this.getClientId()) {
      throw new Error('Missing client id');
    }

    if (!this.getOrg()) {
      throw new Error('Missing org');
    }

    if (responseType === 'code' && !this.getRedirectUri()) {
      throw new Error('Missing redirect uri');
    }

    let oauthUrl = `${this.getBasePath()}/oauth2/${this.getOrg()}/authorize`;

    if (responseType === 'code') {
      oauthUrl += '?response_type=code';
    } else {
      oauthUrl += '?response_type=token';
    }

    oauthUrl += `&client_id=${this.getClientId()}`;

    if (this.getRedirectUri()) {
      oauthUrl += `&redirect_uri=${this.getRedirectUri()}`;
    }

    if (scope) {
      oauthUrl += `&scope=${scope.join(' ')}`;
    }

    if (state) {
      oauthUrl += `&state=${state}`;
    }

    return oauthUrl;
  }

  /**
   * Get the OAuth2 access token using the authorization code grant type
   * @arg {String} code - The authorization code previously received by the authorization server.
   * @arg {Array} scope - The granted access to be given to the access token.
   * @returns {Promise<Object>} - An object containing the access token and associated info.
   */
  getAccessTokenWithCode(code: string, scope: string[] = ['user:all']): AxiosPromise<any> {
    if (!this.getClientId()) {
      throw new Error('Missing client id');
    }

    if (!this.getClientSecret()) {
      throw new Error('Missing client secret');
    }

    if (!this.getRedirectUri()) {
      throw new Error('Missing redirect uri');
    }

    if (!this.getOrg()) {
      throw new Error('Missing org');
    }

    let oauthUrl = `${this.getBasePath()}/oauth2/${this.getOrg()}/token`;
    oauthUrl += '?grant_type=authorization_code';
    oauthUrl += `&code=${code}`;
    oauthUrl += `&client_id=${this.getClientId()}`;
    oauthUrl += `&client_secret=${this.getClientSecret()}`;
    oauthUrl += `&redirect_uri=${this.getRedirectUri()}`;
    oauthUrl += `&scope=${scope.join(' ')}`;

    const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    return this.axiosInstance(oauthUrl, options);
  }

  /**
   * Get the OAuth2 access token using the JWT bearer token grant type
   * @arg {String} email - The email for the user associated with the private key being used.
   * @arg {Buffer} privateKey - Private key to be used to sign the JWT. The associated public key
   * should be registered in Aspera On Cloud and will be used to verify the assertion.
   * @arg {Array} scope - The granted access to be given to the access token.
   * @returns {Promise<Object>} - An object containing the access token and associated info.
   */
  getAccessTokenWithJwt(email: string, privateKey: Buffer, scope: string[] = ['user:all']): AxiosPromise<any> {
    if (isBrowser()) {
      throw new Error('JWT grant type is not available in the browser');
    }

    if (!this.getClientId()) {
      throw new Error('Missing client id');
    }

    if (!this.getClientSecret()) {
      throw new Error('Missing client secret');
    }

    if (!this.getOrg()) {
      throw new Error('Missing org');
    }

    let oauthUrl = `${this.getBasePath()}/oauth2/${this.getOrg()}/token`;
    oauthUrl += '?grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer';

    if (scope) {
      oauthUrl += `&scope=${scope.join(' ')}`;
    }

    // https://github.com/dabrad26/aspera-node-js-jwt-starter/blob/main/index.js
    const basicAuth = Buffer.from(`${this.getClientId()}:${this.getClientSecret()}`).toString('base64');
    const token = this.createSignedJwt(email, privateKey);
    oauthUrl += `&assertion=${token}`;

    const options: AxiosRequestConfig = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basicAuth}`
      }
    };

    return this.axiosInstance(oauthUrl, options);
  }

  private createSignedJwt(email: string, privateKey: Buffer) {
    const now = new Date().getTime() / 1000;
    const origin = new URL(this.getBasePath()).origin;
    const claims = {
      iss: this.getClientId(),
      sub: email,
      aud: `${origin}/api/v1/oauth2/token`,
      nbf: now - 3600,
      exp: now + 3600
    };

    const token = jwt.create(claims, privateKey, 'RS256');
    return token.compact();
  }

  private setAuthorizationHeader(accessToken: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
}
