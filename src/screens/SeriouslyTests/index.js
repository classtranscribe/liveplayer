import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

// source:
// https://github.com/MikeyParton/react-speech-kit/

export function SeriouslyTests() {
  const [value, setValue] = useState('');
  const { speak } = useSpeechSynthesis();

  return (
    <div>Replace me
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button onClick={() => speak({ text: value })}>Speak</button>
    </div>
  );
 };