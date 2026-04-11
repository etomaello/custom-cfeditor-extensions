/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access the Adobe AEM
 *
 */


const fetch = require('node-fetch');
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, stringParameters, checkMissingRequestInputs, isSupportedAuthScheme } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = ['authConfig', 'path', 'aemHost'];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    );
    
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    if (isSupportedAuthScheme(params) === false) {
      return errorResponse(
        400,
        'Unsupported authentication method: ' + params.authConfig.authScheme,
        logger
      );
    }


    const apiEndpoint = `https://${params.aemHost}${params.path}`;

    const response = await fetch(apiEndpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + params.authConfig.imsToken,
      }
    });

    if (!response.ok) {

      const errorBody = await response.text();
      return errorResponse(
        response.status,
        errorBody,
        logger
      );
    }
    const data = await response.json();
    

    // log the response status code
    logger.info(`${response.statusText}: successful request`)
    const result = {
      statusCode: 200,
      body: data,
    };
    return result;
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

exports.main = main
