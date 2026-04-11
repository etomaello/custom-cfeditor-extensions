import React, { useEffect } from 'react';
import { extensionId } from '../../utils/constants';
import { Provider, View, defaultTheme, NumberField } from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import useAutoResizeIframe from '../../hooks/use-auto-resize-iframe';
import useBackgroundColorSetting from '../../hooks/use-background-color-setting';

export default function NumberFieldExtended() {
  const { guestConnection, fieldsValues, model, inputValue } =
    useFieldExtension(extensionId, () => {});
  useAutoResizeIframe(guestConnection);
  const { backgroundColorSetting } = useBackgroundColorSetting(guestConnection);

  useEffect(() => {
    backgroundColorSetting();
  }, [backgroundColorSetting]);

  if (!model || !fieldsValues) {
    return <Provider theme={defaultTheme}>Loading custom field...</Provider>;
  }


  return (
    <Provider
      theme={defaultTheme}
      locale={guestConnection.sharedContext.get('locale')}
    >
      <View width="100%">
        <NumberField
            width="100%"
            label={model.fieldLabel}
            isRequired={model.required}
            defaultValue={inputValue}
            formatOptions={{
                style: "decimal",
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            }}
            isReadOnly
            locale="en-US"
        />
      </View>
    </Provider>
  );
}
