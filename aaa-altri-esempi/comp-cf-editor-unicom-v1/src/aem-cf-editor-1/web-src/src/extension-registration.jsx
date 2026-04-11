import { Text } from '@adobe/react-spectrum';
import { register } from '@adobe/uix-guest';
import { extensionId } from './utils/constants';

function ExtensionRegistration() {
  const init = async () => {
    await register({
      id: extensionId,
      methods: {
        field: {
          getDefinitions() {
            return [
              {
                fieldNameExp: '^statusAem$',
                url: '/#/statusAem-field',
              },
              {
                fieldNameExp: '^startDateEcommerce$',
                url: '/#/start-date-ecommerce',
              },
              {
                fieldNameExp: '^endDateEcommerce$',
                url: '/#/end-date-ecommerce',
              },
              {
                fieldNameExp: '^nameLegacy$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^statusLegacy$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^offerPrice$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^offerDiscount$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^offerDiscount$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^offerFinalPrice$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^offerFinalPriceWithDevice$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^contractualPeriodLegacy$',
                url: '/#/numberField-field',
              },
              {
                fieldNameExp: '^offerDeviceType$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^offerCode$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^bpelCode$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^sourceSystemName$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^skuDeviceLegacy$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^descripitionDeviceLegacy$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^startDateLegacy$',
                url: '/#/date-field',
              },
              {
                fieldNameExp: '^endDateLegacy$',
                url: '/#/date-field',
              },
              {
                fieldNameExp: '^creationDate$',
                url: '/#/date-field',
              },
              {
                fieldNameExp: '^lastModifiedDate$',
                url: '/#/date-field',
              },
              {
                fieldNameExp: '^productsPrices$',
                url: '/#/json-field',
              },
              {
                fieldNameExp: '^svasPrices$',
                url: '/#/json-field',
              },
              {
                fieldNameExp: '^productName$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^family$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^productCode$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^svaNameLegacy$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^svaType$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^svaCode$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^svaCode$',
                url: '/#/text-field',
              },
              {
                fieldNameExp: '^svaPrice$',
                url: '/#/numberField-field',
              },
            ];
          },
        },
      },
    });
  };
  init().catch(console.error);

  return <Text>IFrame for integration with Host (AEM)...</Text>;
}

export default ExtensionRegistration;
