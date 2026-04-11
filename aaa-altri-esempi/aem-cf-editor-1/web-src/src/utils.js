/*
* <license header>
*/

/* global fetch */
import actions from './config.json';
/**
 *
 * Invokes a web action
 *
 * @param  {string} actionUrl
 * @param {object} headers
 * @param  {object} params
 *
 * @returns {Promise<string|object>} the response
 *
 */

async function actionWebInvoke (actionUrl, headers = {}, params = {}, options = { method: 'POST' }) {  
  const actionHeaders = {
    'Content-Type': 'application/json',
    ...headers
  }

  const fetchConfig = {
    headers: actionHeaders
  }

  if (window.location.hostname === 'localhost') {
    actionHeaders['x-ow-extra-logging'] = 'on'
  }

  fetchConfig.method = options.method.toUpperCase()

  if (fetchConfig.method === 'GET') {
    actionUrl = new URL(actionUrl)
    Object.keys(params).forEach(key => actionUrl.searchParams.append(key, params[key]))
  } else if (fetchConfig.method === 'POST') {
    fetchConfig.body = JSON.stringify(params)
  }
  
  const response = await fetch(actionUrl, fetchConfig)

  let content = await response.text()
  
  if (!response.ok) {
    return JSON.parse(content)
  }
  try {
    content = JSON.parse(content)
  } catch (e) {
    // response is not json
    content = JSON.parse("{'error': 'Response is not JSON'}")
  }
  return content
}

async function getInfoFromExternalAPI (authConfig, aemHost, path) {
  
  /**
   *   This should be implemented with a I/O runtime action registered in the app
   *    and then using the actionWebInvoke function with authConfig and aemHost
   *    and adding headers for authentication like:
   * 
   *    Authorization: 'Bearer ' + authConfig.imsToken,
   */
  console.log("getInfoFromExternalAPI called");
  try {
    const apiResponse = await actionWebInvoke(
      actions['aem'],
      {},
      {
        path: path,
        authConfig,
        aemHost,
      },
      { method: 'POST' }
    );
    console.log('Response from "aem" action:', JSON.stringify(apiResponse));

    return apiResponse || {"error": "No data returned from API" };
  } catch (e) {
    console.error(e);

    return {};
  }

}

module.exports = {
  actionWebInvoke,
  getInfoFromExternalAPI
};
