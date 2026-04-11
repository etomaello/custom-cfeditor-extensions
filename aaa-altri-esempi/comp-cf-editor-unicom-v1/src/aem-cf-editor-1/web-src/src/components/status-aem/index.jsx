import React, { useEffect, useState, useCallback } from 'react';
import { extensionId } from '../../utils/constants';
import {
  Provider,
  View,
  defaultTheme,
  Picker,
  Item,
} from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import { isAemStatusDisabled, isValidAemStatus } from '../../utils/validations';
import useAutoResizeIframe from '../../hooks/use-auto-resize-iframe';
import useBackgroundColorSetting from '../../hooks/use-background-color-setting';

export default function StatusAem() {
  const [isMounted, setIsMounted] = React.useState(false);
  const [aemOptionsDisabled, setAemOptionsDisabled] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const {
    guestConnection,
    fieldsValues,
    model,
    inputValue: aemInputValue,
    onInputChange,
  } = useFieldExtension(extensionId, isValidAemStatus);
  useAutoResizeIframe(guestConnection);
  const { backgroundColorSetting } = useBackgroundColorSetting(guestConnection);

  const getAemStatusDisabledArray = useCallback(() => {
    if (model && fieldsValues && fieldsValues.statusLegacy) {
      const aemOptions = model.options.map((option) => ({
        ...option,
        disabled: false,
      }));
      const eamStatusDisabledAux = isAemStatusDisabled(
        fieldsValues.startDateEcommerce,
        fieldsValues.endDateEcommerce,
        fieldsValues.statusLegacy,
        aemOptions,
      );
      setInputValue(aemInputValue);
      setAemOptionsDisabled(eamStatusDisabledAux);
      setIsMounted(true);
    }
  }, [model, fieldsValues]);

  useEffect(() => {
    backgroundColorSetting();
    getAemStatusDisabledArray();
  }, [getAemStatusDisabledArray, backgroundColorSetting]);

  useEffect(() => {
    if (isMounted && aemInputValue) {
      const valueAux = inputValue ? inputValue : aemInputValue;
      const aemValueState = isValidAemStatus(valueAux, aemOptionsDisabled);
      if (inputValue && aemValueState.state === 'valid') {
        setInputValue(aemInputValue);
      } else {
        setInputValue(null);
      }
    }
  }, [aemInputValue, inputValue, aemOptionsDisabled, isMounted]);

  if (!model || !fieldsValues.statusAem) {
    return <Provider theme={defaultTheme}>Loading custom field...</Provider>;
  }

  const handlePickerChange = (value) => {
    setInputValue(value);
    onInputChange(value, aemOptionsDisabled);
  };

  return (
    <Provider
      theme={defaultTheme}
      locale={guestConnection.sharedContext.get('locale')}
    >
      <View width="100%">
        <Picker
          label={model.fieldLabel}
          isRequired={model.required}
          width={'100%'}
          items={[...aemOptionsDisabled]}
          selectedKey={inputValue}
          onSelectionChange={handlePickerChange}
        >
          {(item) => (
            <Item isDisabled={item.disabled} key={item.value}>
              {item.name}
            </Item>
          )}
        </Picker>
      </View>
    </Provider>
  );
}
