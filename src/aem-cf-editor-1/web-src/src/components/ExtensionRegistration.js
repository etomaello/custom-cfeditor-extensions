/*
 * <license header>
 */

import {Text} from "@adobe/react-spectrum";
import {register} from "@adobe/uix-guest";
import {extensionId} from "./Constants";

function ExtensionRegistration() {
  const search = new URLSearchParams(window.location.search);
  if (search.get('repo') != 'author-p127204-e1900935.adobeaemcloud.com' ) {
    return; // skip extension registration if repo does not match desired one
  }
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
              }
            ];
          },
        },
      }
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ExtensionRegistration;
