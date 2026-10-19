# tomaelloAppbuilder

Welcome to my Adobe I/O Application!

## Setup

- Populate the `.env` file in the project root and fill it as shown [below](#env)

## Local Dev

- `aio app run` to start your local Dev server
- App will run on `localhost:9080` by default

By default the UI will be served locally but actions will be deployed and served from Adobe I/O Runtime. To run your actions locally use the `aio app dev` option.

For more information on the difference between `aio app run` and `aio app dev`, see [here](https://developer.adobe.com/app-builder/docs/guides/development/#aio-app-dev-vs-aio-app-run)

### Conditional Content Fragment fields

The `field0` override applies only to the `CF Model Select` model at
`/conf/global/settings/dam/cfm/models/cf-model-select` in
`author-p127204-e1900935.adobeaemcloud.com`. It uses the existing React Spectrum 3
`Picker` and the AEM guest connection; the model's enumeration values remain
strings, not numbers.

| `field0` | Visible field | Hidden field cleared after changing the selection |
| --- | --- | --- |
| `"1"` (Field1) | `field1` | `field2` |
| `"2"` (Field2) | `field2` | `field1` |
| Empty or unexpected | Neither | Both |

Opening a fragment changes visibility only: existing values are never cleared on
initial load, even if they belong to a hidden field. Selecting the same value
again also does not clear anything. AEM can autosave changed selections and
cleared values, so use a test fragment when trying this behavior.

Start the development server with `aio app run`, visit
`https://localhost:9080/`, and ensure its HTTPS certificate is trusted. This
standalone page displays integration instructions; custom fields need the AEM
host and cannot be tested fully in a standalone localhost tab.

Open the test fragment using the [Adobe dev-mode URL](https://experience.adobe.com/?devMode=true&ext=https://localhost:9080&repo=author-p127204-e1900935.adobeaemcloud.com#/@inps/aem/cf/editor/editor/f4f5942b-7b42-4c77-bc12-d88af79036fa).
Sign in to the intended organization and grant **Local network access** for the
Adobe site when Chrome prompts. If previously denied, change that permission in
the site's controls/settings and reload. An administrator may need to allow it
in a managed browser; do not disable browser security globally.

For a manual check, choose Field1, enter text in `field1`, and wait for AEM to
report that it has saved. Choose Field2: `field1` should disappear and its text
should be cleared. Enter text in `field2`, wait for saving, then choose Field1
and verify the reverse. After each change, wait for saving before using
**JSON preview** or reloading to confirm persisted values. AEM's JSON preview
can represent cleared text as `null`.

To check the no-clear-on-open policy, temporarily open a test fragment without
the `devMode` and `ext` parameters, populate both text fields, and wait for
saving. Reopen the dev-mode URL: only the selected field should appear, but
both stored values should remain until the selection changes.

Troubleshooting:

- `ReferenceError: SelectField is not defined` means the route references a
  component without importing it in `App.js`. Importing it also makes the
  bundler check its dependencies; this project uses `@adobe/react-spectrum`,
  not the uninstalled `@react-spectrum/s2/Picker`.
- `ERR_BLOCKED_BY_LOCAL_NETWORK_ACCESS_CHECKS` on the localhost iframe is a
  browser permission problem, separate from React errors. Check the Adobe
  site's Local network access permission.
- If initialization or a host write fails, the field displays an error and
  stops accepting further selections. Some writes may already have saved;
  inspect the fragment and reload rather than assuming the operation was
  atomic.
- The guest SDK automatically sizes its iframe from the body. The picker
  reserves body height while open so the menu is not clipped.
- In the current AEM editor, Canvas Data API `setStyles` hides a text field
  and its label, but its separately rendered character counter can remain
  visible. The extension does not manipulate the cross-origin host DOM to
  work around this host limitation.

## Test & Coverage

- Run `aio app test` to run unit tests for ui and actions
- Run `aio app test --e2e` to run e2e tests
- Run `npm test -- --runInBand` for the conditional-field regression tests.
- Run `aio app build --no-actions` to build the extension's web assets.
- The existing `npm run lint` excludes `web-src`; it does not validate the UI.

## Deploy & Cleanup

- `aio app deploy` to build and deploy all actions on Runtime and static files to CDN
- `aio app undeploy` to undeploy the app

## Config

### `.env`

You can generate this file using the command `aio app use`. 

```bash
# This file must **not** be committed to source control

## please provide your Adobe I/O Runtime credentials
# AIO_RUNTIME_AUTH=
# AIO_RUNTIME_NAMESPACE=
```

### `app.config.yaml`

- Main configuration file that defines an application's implementation. 
- More information on this file, application configuration, and extension configuration 
  can be found [here](https://developer.adobe.com/app-builder/docs/guides/configuration/#appconfigyaml)

#### Action Dependencies

- You have two options to resolve your actions' dependencies:

  1. **Packaged action file**: Add your action's dependencies to the root
   `package.json` and install them using `npm install`. Then set the `function`
   field in `app.config.yaml` to point to the **entry file** of your action
   folder. We will use `webpack` to package your code and dependencies into a
   single minified js file. The action will then be deployed as a single file.
   Use this method if you want to reduce the size of your actions.

  2. **Zipped action folder**: In the folder containing the action code add a
     `package.json` with the action's dependencies. Then set the `function`
     field in `app.config.yaml` to point to the **folder** of that action. We will
     install the required dependencies within that directory and zip the folder
     before deploying it as a zipped action. Use this method if you want to keep
     your action's dependencies separated.

## Debugging in VS Code

While running your local server (`aio app dev`), both UI and actions can be debugged. To do so follow the instructions [here](https://developer.adobe.com/app-builder/docs/guides/development/#debugging)

## Typescript support for UI

To use typescript use `.tsx` extension for react components and add a `tsconfig.json` 
and make sure you have the below config added
```
 {
  "compilerOptions": {
      "jsx": "react"
    }
  } 
```
