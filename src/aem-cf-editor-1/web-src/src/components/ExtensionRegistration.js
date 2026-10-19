/*
 * <license header>
 */

import React, {useEffect, useState} from "react";
import {Provider, Text, defaultTheme} from "@adobe/react-spectrum";
import {register} from "@adobe/uix-guest";
import {extensionId} from "./Constants";

function ExtensionRegistration() {
  const [error, setError] = useState(null);
  const supportedRepo = new URLSearchParams(window.location.search).get("repo")
    === "author-p127204-e1900935.adobeaemcloud.com";
  const hosted = window.parent !== window;

  useEffect(() => {
    if (!supportedRepo || !hosted) {
      return;
    }
    let active = true;
    const init = async () => {
      const guestConnection = await register({
        id: extensionId,
        methods: {
          headerMenu: {
            getButtons() {
              return [
                // @todo YOUR HEADER BUTTONS DECLARATION SHOULD BE HERE
                {
                  id: 'custom',
                  label: 'Custom',
                  icon: 'OpenIn',
                  onClick() {
                    const modalURL = "/index.html#/custom-modal";
                    console.log("Modal URL: ", modalURL);

                    guestConnection.host.modal.showUrl({
                      title: "Custom",
                      url: modalURL,
                    });
                  },
                },
              ];
            },
          },
          field: {
            getDefinitions: () => {
              return [
                {
                  fieldNameExp: '^isDisabled$',
                  url: '/#/hidden-field',
                },
                {
                  fieldNameExp: '^field0$',
                  modelPathExp: '^/conf/global/settings/dam/cfm/models/cf-model-select$',
                  url: '/#/select-field',
                }
              ];
            },
          },
        },
      });
    };
    init().catch((error) => {
      console.error("Unable to register the Content Fragment extension:", error);
      if (active) {
        setError(error.message || String(error));
      }
    });
    return () => {
      active = false;
    };
  }, [supportedRepo, hosted]);

  return (
    <Provider theme={defaultTheme}>
      {error ? (
        <div role="alert">Unable to register the extension: {error}</div>
      ) : (
        <Text>
          {supportedRepo && hosted
            ? "IFrame for integration with Host (AEM)..."
            : "Open this extension through the AEM Content Fragment Editor dev-mode URL for the supported repository."}
        </Text>
      )}
    </Provider>
  );
}

export default ExtensionRegistration;
