import React, { useEffect, useCallback } from 'react';

import {
  Provider,
  View,
  defaultTheme,
  DatePicker,
} from '@adobe/react-spectrum';
import { useFieldExtension } from '../../hooks/use-field-extension';
import { extensionId } from '../../utils/constants';
import { isEndDateWithinRange } from '../../utils/validations';
import { parseDate } from '@internationalized/date';
import ErrorMessage from '../error-message';
import useAutoResizeIframe from '../../hooks/use-auto-resize-iframe';

export default function endDateEcommerce() {
  const {
    guestConnection,
    fieldsValues,
    model,
    inputValue: eamInputValue,
    onInputChange,
    validation,
  } = useFieldExtension(extensionId, isEndDateWithinRange);
  useAutoResizeIframe(guestConnection);
  const [isMounted, setIsMounted] = React.useState(false);
  const [inputValue, setInputValue] = React.useState();

  const backgroundColorSetting = useCallback(() => {
    if (guestConnection)
      document.body.style.backgroundColor = guestConnection.sharedContext
        .get('theme')
        .includes('dark')
        ? 'black'
        : 'white';
  }, [guestConnection]);

  useEffect(() => {
    if (eamInputValue && !isMounted) {
      backgroundColorSetting();
      document.body.style.height = '56.5px';
      document.body.style.overflow = 'hidden';
      setIsMounted(true);
      setInputValue(parseDate(eamInputValue));
    }
  }, [eamInputValue, isMounted]);

  if (!model || !fieldsValues.endDateEcommerce || !eamInputValue) {
    return <Provider theme={defaultTheme}>Loading custom field...</Provider>;
  }


  const handleDateFieldChange = (value) => {
    const valueFormated = `${value.year}-${String(value.month).padStart(
      2,
      '0',
    )}-${String(value.day).padStart(2, '0')}`;
    setInputValue(value);
    onInputChange(
      valueFormated,
      fieldsValues.startDateEcommerce,
      fieldsValues.startDateLegacy,
      fieldsValues.endDateLegacy,
    );
  };


  return (
    <Provider
      theme={defaultTheme}
      locale={guestConnection.sharedContext.get('locale')}
    >
      <View width="100%" height="100%">
        <DatePicker
          aria-label={model.fieldLabel}
          isRequired={model.required}
          label={model.fieldLabel}
          name={model.name}
          value={inputValue}
          granularity="day"
          onChange={handleDateFieldChange}
          errorMessage={<ErrorMessage {...validation} />}
          validationState={validation.state}
        />
      </View>
    </Provider>
  );
}
