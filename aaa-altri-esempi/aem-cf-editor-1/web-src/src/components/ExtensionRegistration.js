/*
 * <license header>
 */

import { Text } from "@adobe/react-spectrum";
import { register } from "@adobe/uix-guest";
import { extensionId } from "./Constants";

function ExtensionRegistration() {
  const search = new URLSearchParams(window.location.search);
  if (search.get('repo') != 'author-p58809-e1469447.adobeaemcloud.com' ) {
    return; // skip extension registration if repo does not match desired one
  }
  const init = async () => {
    const guestConnection = await register({
      id: extensionId,
      methods: {
        field: {
          getDefinitions: () => {
            /*
            Available properties to use with regex to match the field
            pathExp
            fieldTypeExp
            fieldNameExp
            modelPathExp
            */
            return [
              {
                fieldTypeExp: 'localizedtextfield$',
                url: '/#/localized-field',
              },
              {
                fieldNameExp: '^indexingDate$',
                url: '/#/indexing-field',
              },
              {
                fieldNameExp: 'formatIcon$',
                modelPathExp: 'video$',
                url: '/#/hidden-field/video-format',
              },
              {
                fieldNameExp: '^youtubeinfo$',
                url: '/#/externalinfobutton-field/api.youtube.json',
              },
              /** Example matches with custom glossary2- model */
              {
                fieldNameExp: 'content$',
                modelPathExp: 'glossary(.*?)$',
                url: '/#/table-field/glossaryContent',
              },
              {
                fieldNameExp: 'content$',
                modelPathExp: 'datafixed(.*?)$',
                url: '/#/table-field/dataFullConfiguration',
              },
              {
                fieldNameExp: 'title$',
                modelPathExp: 'glossary(.*?)$',
                url: '/#/localized-field',
              },
              {
                fieldNameExp: 'title$',
                modelPathExp: 'datafixed(.*?)$',
                url: '/#/localized-field',
              },
              {
                fieldNameExp: '_EniType$',
                modelPathExp: 'glossary(.*?)$',
                url: '/#/hidden-field/table',
              },
              {
                fieldNameExp: '_EniType$',
                modelPathExp: 'datafixed(.*?)$',
                url: '/#/hidden-field/table',
              }
            ]
            
          }
        },
        rightPanel: {
                        addRails() {
                            return [
                                {
                                    id: "my.company.panel_1",
                                    header: "Last Changes",
                                    url: '/#/rail/prova',
                                    icon: 'Export',
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
