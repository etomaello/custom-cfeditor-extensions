import React, { useEffect } from 'react';
import { extensionId } from '../../utils/constants';
import {
  Provider,
  View,
  defaultTheme,
  DatePicker,
} from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import useBackgroundColorSetting from '../../hooks/use-background-color-setting';
import { parseDate, parseAbsoluteToLocal } from '@internationalized/date';

export default function DateFieldExtended() {
  const {
    guestConnection,
    fieldsValues,
    model,
    inputValue: eamInputValue,
  } = useFieldExtension(extensionId, () => {});
  const [inputValue, setInputValue] = React.useState();
  const { backgroundColorSetting } = useBackgroundColorSetting(guestConnection);

  const getInputValue = (eamInputValue) => {
    const dateValidation = /T.*Z$/.test(eamInputValue);
    const parsedDate = eamInputValue
      ? dateValidation
        ? parseAbsoluteToLocal(eamInputValue)
        : parseDate(eamInputValue)
      : null;

    return parsedDate;
  };

  useEffect(() => {
    if (eamInputValue) {
      backgroundColorSetting();
      document.body.style.height = '60px';
      document.body.style.overflow = 'hidden';
      const parsedDate = getInputValue(eamInputValue);

      setInputValue(parsedDate);
    }
  }, [backgroundColorSetting, eamInputValue]);

  if (!model || !fieldsValues) {
    return <Provider theme={defaultTheme}>Loading custom field...</Provider>;
  }

  return (
    <Provider
      theme={defaultTheme}
      locale={guestConnection.sharedContext.get('locale')}
    >
      <View width="100%">
        <DatePicker
          aria-label={model.fieldLabel}
          label={model.fieldLabel}
          isRequired={model.required}
          value={inputValue}
          isReadOnly
        />
      </View>
    </Provider>
  );
}
