export const extensionId = 'chatgpt-editor-extension-demo';
export const microsegmentsRTDPath = 'scripts/microsegments_rtd.json';
export const ValidationMessages = {
  Ok: {
    message: 'Valid value',
    state: 'valid',
  },
  Invalid: {
    message: 'invalid value',
    state: 'invalid',
  },
};

export const StartDateValidationMessages = {
  LessThanLegacyStartDateofValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é menor que o início da vigência no legado',
  },
  GreaterThanLegacyEndDateOfValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é maior que o fim da vigência no legado',
  },
  GreaterThanEndDateOfValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é maior que o fim da vigência informada',
  },
  LessThanCurrentDate: {
    state: 'invalid',
    message: 'Digite uma data válida, a data inserida é menor que a data atual',
  },
};

export const DateFieldConstants = {
  label: 'Data de Início da Vigência Ecommerce',
  defaultValue: '2021-01-01',
};

export const StatusAemOptions = {
  approved: 'aprovado',
  programmed: 'programado',
  verification: 'verificacao',
  failed: 'reprovado',
};

export const EndDateValidationMessages = {
  LessThanLegacyStartDateOfValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é menor que o início da vigência no legado',
  },
  GreaterThanLegacyEndDateOfValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é maior que o fim da vigência no legado',
  },
  LessThanStartDateOfValidity: {
    state: 'invalid',
    message:
      'Digite uma data válida, a data inserida é menor que o início da vigência informada',
  },
};
