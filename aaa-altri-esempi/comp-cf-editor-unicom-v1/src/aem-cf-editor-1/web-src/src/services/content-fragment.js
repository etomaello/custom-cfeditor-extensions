export const validateFragmentUniqueId = async (
  sharedContext,
  fragmentPath,
  fieldModel,
  value,
) => {
  const params = new URLSearchParams({
    fieldName: fieldModel.name,
    fragmentPath,
    value,
  });

  const options = {
    headers: {
      Authorization: `Bearer ${sharedContext.get('auth').imsToken}`,
    },
  };

  const response = await fetch(
    `https://${sharedContext.get(
      'aemHost',
    )}/mnt/overlay/dam/cfm/admin/components/authoring/validations/uniquefield.json?${params}`,
    options,
  );

  const jsonResponse = await response.json();
  return jsonResponse;
};
