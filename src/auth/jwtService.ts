import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';

import { baseURL } from '@/utils/constant';

import jwtDefaultConfig from './jwtDefaultConfig';

// const axios: AxiosStatic = require('axios');
const headers: AxiosRequestConfig['headers'] = {
  'Content-Type': 'application/json',
};

export default class JwtService {
  // ** jwtConfig <= Will be used by this service
  jwtConfig = { ...jwtDefaultConfig };

  // ** For refreshing token
  isAlreadyFetchingAccessToken = false;

  subscribers: ((token: string) => void)[] = [];

  private httpInstance: AxiosInstance;

  constructor(jwtOverrideConfig: any) {
    const httpInstance = axios.create({ baseURL, headers });

    this.jwtConfig = { ...this.jwtConfig, ...jwtOverrideConfig };

    // ** request interceptor
    httpInstance.interceptors.request.use(
      (config: AxiosRequestConfig | any) => {
        // ** get token from localStorage
        const accessToken = this.getToken();
        if (accessToken) {
          // eslint-disable-next-line no-param-reassign
          config.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // ** add request/response interceptor
    httpInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        const { config, response } = error;
        const originalRequest = config;

        // ** if status === 401
        if (response && response.status === 401) {
          if (!this.isAlreadyFetchingAccessToken) {
            this.refreshToken().then((res) => {
              this.isAlreadyFetchingAccessToken = true;

              // ** update accessToken in localStorage
              this.setToken(res.data.accessToken);
              this.setRefreshToken(res.data.refreshToken);

              this.onAccessTokenFetched(res.data.accessToken);
            });
          }
          const retryOriginalRequest = new Promise((resolve) => {
            this.addSubscriber((accessToken: string) => {
              // ** change authorization header
              originalRequest.headers.Authorization = `${this.jwtConfig.tokenType} ${accessToken}`;
              resolve(this.httpInstance(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );

    this.httpInstance = httpInstance;
  }

  onAccessTokenFetched(accessToken: string) {
    this.subscribers = this.subscribers.filter(
      (callback: (token: string) => void) => callback(accessToken)
    );
  }

  addSubscriber(callback: (token: string) => void) {
    this.subscribers.push(callback);
  }

  setToken(value: string) {
    return localStorage.setItem(this.jwtConfig.storageTokenKeyName, value);
  }

  setRefreshToken(value: string) {
    return localStorage.setItem(
      this.jwtConfig.storageRefreshTokenKeyName,
      value
    );
  }

  getToken() {
    return localStorage.getItem(this.jwtConfig.storageTokenKeyName);
  }

  getRefreshToken() {
    return localStorage.getItem(this.jwtConfig.storageRefreshTokenKeyName);
  }

  refreshToken() {
    return this.httpInstance.post(this.jwtConfig.refreshEndpoint, {
      refreshToken: this.getRefreshToken(),
    });
  }
}
