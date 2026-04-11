import { useCallback, useState } from 'react';

function useBackgroundColorSetting(connection) {
  const [theme, setTheme] = useState('light');
  const backgroundColorSetting = useCallback(() => {
    if (connection) {
      const AEMTheme = connection.sharedContext.get('theme').includes('dark');

      document.body.style.backgroundColor = AEMTheme ? 'black' : 'white';

      setTheme(AEMTheme ? 'dark' : 'light');
    }
  }, [connection]);

  return { backgroundColorSetting, theme };
}

export default useBackgroundColorSetting;
