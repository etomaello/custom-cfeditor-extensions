export const isValidAemProgram = (programId) => {
  const aemHost = new URLSearchParams(window.location.search).get('repo');

  const aemHostRegex = new RegExp(
    `^author-${programId}-e[\\d]+\\.adobeaemcloud\\.com$`,
  );
  return aemHostRegex.test(aemHost);
};

export const createHrefLinkToContentFragment = (contentFragmentPath) => {
  const url = new URL(window.location.href);

  const [baseRepo] = url.searchParams.get('repo').split('/cf/editor/editor/');

  url.searchParams.set(
    'repo',
    `${baseRepo}/cf/editor/editor/${contentFragmentPath}`,
  );

  return url.toString();
};
