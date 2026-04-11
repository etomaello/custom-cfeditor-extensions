import { useEffect } from 'react';

function useAutoResizeIframe(connection) {
  useEffect(() => {
    if (!connection) return;

    function getContentHeight() {
      const allElements = Array.from(document.body.querySelectorAll('*'));
      let minTop = Infinity;
      let maxBottom = 0;

      allElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = rect.bottom + window.scrollY;

        if (top < minTop) minTop = top;
        if (bottom > maxBottom) maxBottom = bottom;
      });

      return maxBottom - minTop;
    }

    async function sendHeight() {
      const height = getContentHeight();
      await connection.host.field.setHeight(height);
    }

    const resizeObserver = new ResizeObserver(sendHeight);
    resizeObserver.observe(document.body);

    const mutationObserver = new MutationObserver(sendHeight);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window.addEventListener('click', sendHeight);
    window.addEventListener('focusin', sendHeight);
    window.addEventListener('input', sendHeight);
    window.addEventListener('load', sendHeight);

    // const interval = setInterval(sendHeight, 500);
    sendHeight();

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('click', sendHeight);
      window.removeEventListener('focusin', sendHeight);
      window.removeEventListener('input', sendHeight);
      window.removeEventListener('load', sendHeight);
      // clearInterval(interval);
    };
  }, [connection]);
}

export default useAutoResizeIframe;
