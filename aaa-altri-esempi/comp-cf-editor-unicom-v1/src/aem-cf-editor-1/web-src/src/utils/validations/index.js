import {
  StartDateValidationMessages,
  StatusAemOptions,
  ValidationMessages,
  EndDateValidationMessages,
} from '../constants';

export const isEmptyValue = (model, inputValue) => {
  return model.required && inputValue === '';
};

export const isStartDateWithinRange = (
  inputValue,
  endValue,
  legacyStartValue,
  legacyEndValue,
) => {
  const now = new Date();
  const nowFormated = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  let validation = ValidationMessages.Ok;

  if (inputValue < nowFormated)
    validation = StartDateValidationMessages.LessThanCurrentDate;

  if (inputValue < legacyStartValue)
    validation = StartDateValidationMessages.LessThanLegacyStartDateofValidity;

  if (inputValue > endValue)
    validation = StartDateValidationMessages.GreaterThanEndDateOfValidity;

  if (inputValue > legacyEndValue)
    validation = StartDateValidationMessages.GreaterThanLegacyEndDateOfValidity;

  return validation;
};

export const isAemStatusDisabled = (
  startDate,
  endDate,
  legacyStatus,
  aemOptions,
) => {
  let optionsDisabledAux = [];

  optionsDisabledAux = assigningAemStatus(
    [StatusAemOptions.verification],
    aemOptions,
    false,
  );
  const now = new Date();
  const nowFormated = `${now.getFullYear()}-${String(
    now.getMonth() + 1,
  ).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (startDate > nowFormated) {
    optionsDisabledAux = assigningAemStatus(
      [StatusAemOptions.approved],
      aemOptions,
    );
    optionsDisabledAux = assigningAemStatus(
      [StatusAemOptions.programmed],
      aemOptions,
      false,
    );
  }

  if (startDate === nowFormated) {
    optionsDisabledAux = assigningAemStatus(
      [StatusAemOptions.programmed],
      aemOptions,
    );
    optionsDisabledAux = assigningAemStatus(
      [StatusAemOptions.approved],
      aemOptions,
      false,
    );
  }

  if (endDate < nowFormated)
    optionsDisabledAux = assigningAemStatus(
      [
        StatusAemOptions.approved,
        StatusAemOptions.programmed,
        StatusAemOptions.verification,
      ],
      aemOptions,
    );

  if (legacyStatus.toLowerCase() === StatusAemOptions.failed)
    optionsDisabledAux = assigningAemStatus(
      [
        StatusAemOptions.approved,
        StatusAemOptions.programmed,
        StatusAemOptions.verification,
      ],
      aemOptions,
    );

  if (!startDate || !endDate)
    optionsDisabledAux = assigningAemStatus(
      [
        StatusAemOptions.approved,
        StatusAemOptions.programmed,
        StatusAemOptions.verification,
        StatusAemOptions.failed,
      ],
      aemOptions,
    );

  return optionsDisabledAux;
};

export const assigningAemStatus = (
  aemOptionValue,
  aemOptions,
  value = true,
) => {
  aemOptions.map((option) => {
    if (aemOptionValue.includes(option.value)) option.disabled = value;
  });
  return aemOptions;
};

export const isValidAemStatus = (inputValue, aemOptions) => {
  const aemOption = aemOptions.filter(({ disabled }) => disabled);
  const hasDisabledOption = aemOption.filter((option) =>
    Object.values(option).includes(inputValue),
  );

  return hasDisabledOption.length > 0
    ? ValidationMessages.Invalid
    : ValidationMessages.Ok;
};
export const isEndDateWithinRange = (
  inputValue,
  startValue,
  legacyStartValue,
  legacyEndValue,
) => {
  let validation = ValidationMessages.Ok;

  if (inputValue < startValue) {
    validation = EndDateValidationMessages.LessThanStartDateOfValidity;
  }

  if (inputValue < legacyStartValue) {
    validation = EndDateValidationMessages.LessThanLegacyStartDateOfValidity;
  }

  if (inputValue > legacyEndValue) {
    validation = EndDateValidationMessages.GreaterThanLegacyEndDateOfValidity;
  }

  return validation;
};
