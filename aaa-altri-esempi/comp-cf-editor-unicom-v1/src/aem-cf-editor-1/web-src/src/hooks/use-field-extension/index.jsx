import { useEffect, useState, useCallback } from 'react';
import { attach } from '@adobe/uix-guest';
import { isEmptyValue } from '../../utils/validations';
import { ValidationMessages } from '../../utils/constants';

export const useFieldExtension = (extensionId, validationFunciton) => {
  const [aemContext, setAemContext] = useState({});
  const [fieldsValues, setFieldsValues] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [validation, setValidation] = useState(ValidationMessages.Ok);

    useEffect(() => {
    const init = async () => {
      const guestConnection = await attach({ id: extensionId });

      const [model, contentFragment, defaultValue] = await Promise.all([
        guestConnection.host.field.getModel(),
        guestConnection.host.contentFragment.getContentFragment(),
        guestConnection.host.field.getDefaultValue(),
      ]);

      setAemContext({
        guestConnection,
        model,
        contentFragment,
        defaultValue,
      });
      setInputValue(defaultValue);
      if (isEmptyValue(model, defaultValue)) {
        setValidation(ValidationMessages.Required);
      }
    };

    init().catch(console.error);
  }, [extensionId]);

  useEffect(() => {
    const checkEnumValueInterval = setInterval(async () => {
      if (aemContext.guestConnection) {
        const dataApi = await aemContext.guestConnection.host.dataApi.get();
        const fields = await dataApi.getFields();
        const hasUpdate = fields.some(
          (field) => fieldsValues[field.name] !== field.value,
        );
        if (hasUpdate) {
          const newFieldsValues = fields.reduce(
            (acc, field) => ({ ...acc, [field.name]: field.value }),
            {},
          );
          setFieldsValues(newFieldsValues);
        }
      }
    }, 1500);

    return () => clearInterval(checkEnumValueInterval);
  }, [aemContext, fieldsValues]);

  const onInputChange = useCallback(
    async (inputValue, ...extraValues) => {
      setInputValue(inputValue);
      if (isEmptyValue(aemContext.model, inputValue)) {
        setValidation(ValidationMessages.Required);
        return;
      }
      const validation = validationFunciton(inputValue, ...extraValues);
      setValidation(validation);
      validation.state === 'valid' &&
        aemContext.guestConnection.host.field.onChange(inputValue);
    },

    [aemContext.model, validationFunciton, aemContext.guestConnection],
  );

  return {
    ...aemContext,
    inputValue,
    validation,
    onInputChange,
    setValidation,
    fieldsValues,
  };
};
