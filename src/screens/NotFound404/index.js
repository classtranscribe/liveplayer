import React, { useEffect } from 'react';
import { CTErrorWrapper } from 'layout';
import { links } from 'utils';

export function NotFound404() {
  useEffect(() => {
    links.title('404');
  }, []);

  return (
    <CTErrorWrapper 
      navbar 
      show
      goHomeButton
      retry={false}
      redirectUri={links.home()} 
    />
  );
}
