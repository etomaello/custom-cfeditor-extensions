# ChatGPT rich text editor sample extension - ChatGPT rich text editor sample extension

This extensions adds ChatGPT support to rich text editor in CF Editor.

The extensions adds ChatGPT support to rich text editor in CF Editor

## Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

## Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default, the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To start a
local serverless stack and also run your actions locally use the `aio app run --local` option.

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

Add or fill `OPENAI` credentials in `.env` file

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
# OPENAI_API_KEY=
# OPENAI_ORG=
```





### Rodando em ambiente local o projeto de extensão
aio app run

# modelos antigos (com custom data types - statusAem não funciona aqui porque não recebemos os dados corretamente por ser custom data type...)
https://experience.adobe.com/?devMode=true&ext=https://localhost:9080&repo=author-p65775-e732838.adobeaemcloud.com#/@telefonicavivo/aem/cf/editor/editor/content%2Fdam%2Fvivo%2Fe-commerce-telco%2Fcatalog%2Fproduct%2Fproduct-11200/tabs/Produto

https://experience.adobe.com/?devMode=true&ext=https://localhost:9080&repo=author-p65775-e732838.adobeaemcloud.com#/@telefonicavivo/aem/cf/editor/editor/content%2Fdam%2Fvivo%2Fe-commerce-telco%2Fcatalog%2Foffer%2Foffer-20_02/tabs/Oferta



# modelos de teste (sem custom data types)
https://experience.adobe.com/?devMode=true&ext=https://localhost:9080&repo=author-p65775-e732838.adobeaemcloud.com#/@telefonicavivo/aem/cf/editor/editor/content%2Fdam%2Fvivo%2Fe-commerce-telco%2Fcatalog%2Funicom%2Foffer-12_34