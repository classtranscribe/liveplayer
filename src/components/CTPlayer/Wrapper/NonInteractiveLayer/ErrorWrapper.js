import React from 'react';
import { CTFragment, CTText } from 'layout';
import { user } from 'utils';

function ErrorWrapper({ error }) {
  let errorPrompt = <CTText white size="medium">Media Unavailable: {error} Error</CTText>;
  if (error === 401) {
    if (user.isLoggedIn) {
      errorPrompt = (
        <CTText white size="medium" textCenter>
          Unauthorized Access: <br />
          Sorry, you are not authorized for your requested page or resource.
        </CTText>
      );
    } 
  }

  return (
    <CTFragment center dFlexCol>      
      {errorPrompt}
    </CTFragment>
  );
}

export default ErrorWrapper;
