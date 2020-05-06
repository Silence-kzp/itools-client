import React from 'react';
import { Upload } from 'antd';
import TTSRecorder from './tts-recorder';

export default function() {
    // useEffect(function () {
    //     const re = new TTSRecorder({});
    //     re.run('杨威是傻逼');
    // }, [])
    return <div className="tts">
        <Upload.Dragger name="file" beforeUpload={onAction}>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
        </Upload.Dragger>
    </div>
}