// @flow weak

import axios          from 'axios';
import {
  getMethod,
  jsonHeader,
  defaultOptions,
  getLocationOrigin
}                     from '../fetchTools';

export const getPositions = (
  endpoint = 'api/positions'
) => {
  const method  = getMethod.method;
  const headers = jsonHeader;
  const url     = `${getLocationOrigin()}/${endpoint}`;
  const options = {...defaultOptions};

  return axios.request({
    method,
    url,
    withCredentials: true,
    ...headers,
    ...options
  })
  .then(data => data.data)
  .catch(error => Promise.reject(error));
};

export const getUnits = (
  endpoint = 'api/units'
) => {
  const method  = getMethod.method;
  const headers = jsonHeader;
  const url     = `${getLocationOrigin()}/${endpoint}`;
  const options = {...defaultOptions};

  return axios.request({
    method,
    url,
    withCredentials: true,
    ...headers,
    ...options
  })
  .then(data => data.data)
  .catch(error => Promise.reject(error));
};

export const getRates = (
  endpoint = 'https://dev.kwayisi.org/apis/forex/usd'
) => {
  const method  = getMethod.method;
  const headers = jsonHeader;
  const url     = `${endpoint}`;
  const options = {...defaultOptions};
  
  return axios.request({
    method,
    url,
    ...headers,
    ...options
  })
  .then(data => data.data.rates)
  .catch(error => Promise.reject(error));
};
