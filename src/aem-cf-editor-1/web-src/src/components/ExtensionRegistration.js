/*
 * <license header>
 */

import React, {useEffect, useState} from "react";
import {register} from "@adobe/uix-guest";
import {extensionId} from "./Constants";

function ExtensionRegistration() {
  const [error, setError] = useState(null);
  const enabled = window.parent !== window && new URLSearchParams(window.location.search).get("repo")
    === "author-p127204-e1900935.adobeaemcloud.com";

  useEffect(() => {
    if (!enabled) {
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
            getDefinitions: () => [
              {
                fieldNameExp: '^isDisabled$',
                url: '/#/hidden-field',
              },
              {
                fieldNameExp: '^field0$',
                modelPathExp: '^/conf/global/settings/dam/cfm/models/cf-model-select$',
                url: '/#/select-field',
              },
            ],
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
  }, [enabled]);

  return (
    <p role={error ? "alert" : undefined}>
      {error ? `Unable to register the extension: ${error}` : enabled
        ? "IFrame for integration with Host (AEM)..."
        : "Open this extension through the AEM Content Fragment Editor dev-mode URL for the supported repository."}
    </p>
  );
}

export default ExtensionRegistration;
