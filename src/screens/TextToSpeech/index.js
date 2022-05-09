import React, { useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';

// source:
// https://github.com/MikeyParton/react-speech-kit/

export function TTSExample() {
  const [value, setValue] = useState('');
  const { speak } = useSpeechSynthesis();

  return (
    <div>
      <textarea
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button onClick={() => speak({text: value, volume: 0.7, rate: 1.1})}>Speak</button>
    </div>
  );
 };