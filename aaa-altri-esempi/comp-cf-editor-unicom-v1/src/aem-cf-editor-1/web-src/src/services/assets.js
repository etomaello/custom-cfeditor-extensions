export const getAsset = async (sharedContext, path) => {
  const aemHost = sharedContext.get('aemHost');
  const url = `https://${aemHost}/api/assets/${path}`;
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sharedContext.get('auth').imsToken}`,
    },
  });

  return await res.json();
};
