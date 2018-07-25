// @flow weak

import axios          from 'axios';
import {
  getMethod,
  jsonHeader,
  defaultOptions,
  getLocationOrigin
}                     from '../fetchTools';
import DeviceAddAlarm from 'material-ui/SvgIcon';

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
  .then(data => { 
    console.log('ddd - ',data.data)
    return data.data.map(({id: keyid , fuOriginId: id, data: {currency:{ccy, notionalValue}}})=>({keyid, id, ccy, notionalValue}));
   })
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
  .then(data => data.data.map(({name, id})=>({id, name})))
  .catch(error => Promise.reject(error));
};

export const getRates = (
  ccy
) => {
  const method  = getMethod.method;
  const headers = jsonHeader;
  const PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
  const url     = `${PROXY_URL}https://free.currencyconverterapi.com/api/v6/convert?q=USD_${ccy}&compact=y`;
  const options = {...defaultOptions};
  
  return axios.request({
    method,
    url,
    ...headers,
    ...options
  })
  .then(data => data.data)
  .catch(error => Promise.reject(error));
};

export const getAllData = (
) => {
  
    return getPositions().then((positions) => {
       return positions ;
    }).then((positions) => {
       return getUnits().then((units) => {
          positions.forEach((position) => {
            const unit = units.find(unit => unit.id === position.id);
            position['name'] = unit ? unit.name : '';
          })          
          return positions;
       })     
    }).then((positions) => {
        let promises = [];
        positions.forEach((position) => {
          promises.push(getRates(position.ccy).then((result) => { 
            position['rate'] = result[`USD_${position.ccy}`].val; 
            position['calculated'] = (position['rate'] * position['notionalValue']).toFixed(2);
            return position;
          }) );
        })        
        return Promise.all(promises);      
    })



}