import React from 'react';
import TTSRecorder from './tts-recorder';

export default function() {
    const re = new TTSRecorder({});
    re.run();
    return <div></div>
}