import React from 'react';

export default (props) => {
  const style = {
    display: 'block', 
    width: '300px', 
    margin: '10px'
  };
  
  return (
    <header style={style}>
      <h1>Oh hi</h1>
      <p>
        Upload one or more audio files. Click 'create waveform'
        to generate a waveform from the currently selected file 
        (you can change its audio source later).
        Use the dropdown menu on the waveform to change its audio 
        file source. Click 'remove' to remove the waveform.
      </p>
    </header>
  );
}