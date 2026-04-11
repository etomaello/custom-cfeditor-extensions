import React, { useEffect } from 'react';
import { extensionId } from '../../utils/constants';
import { Provider, View, defaultTheme, TextField } from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import useAutoResizeIframe from '../../hooks/use-auto-resize-iframe';
import useBackgroundColorSetting from '../../hooks/use-background-color-setting';

export default function TextFieldExtended() {
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
        <TextField
          width="100%"
          label={model.fieldLabel}
          isRequired={model.required}
          value={inputValue}
          isReadOnly
        />
      </View>
    </Provider>
  );
}
