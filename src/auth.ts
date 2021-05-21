import { AsperaOnCloudOptions } from './aspera-on-cloud';
import axios, { AxiosRequestConfig } from 'axios';
import { getServerUrl } from './utils';

export class AsperaOnCloudAuth {
  accessToken?;
  axiosInstance;
  basePath?;
  clientId?;
  clientSecret?;
  org?;
  redirectUri?;

  constructor(options: AsperaOnCloudOptions) {
    options = options || {};

    this.accessToken = options.accessToken;
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

    if (this.accessToken) {
      this.setAuthorizationHeader(this.accessToken);
    }
  }

  getAccessToken() {
    return this.accessToken;
  }

  getAxios() {
    return this.axiosInstance;
  }

  getBasePath() {
    return this.basePath;
  }

  getClientId() {
    return this.clientId;
  }

  getClientSecret() {
    return this.clientSecret;
  }

  getOrg() {
    return this.org;
  }

  getRedirectUri() {
    return this.redirectUri;
  }

  setAccessToken(accessToken: string) {
    this.accessToken = accessToken;
    this.setAuthorizationHeader(accessToken);
  }

  setAuthorizationHeader(accessToken: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }

  /** Get the OAuth2 URL used for Aspera on Cloud API authentication */
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

  /** Get the OAuth2 access token using an OAuth2 access code */
  getAccessTokenWithCode(code: string, scope: string[] = ['user:all']): Promise<any> {
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
}
