import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64'
import TransWorker from 'worker-loader!./transcode.worker';

const APPID = '5e622cec';
const API_SECRET = '1a2826d9c9fe18c7b4f46455743becd8';
const API_KEY = '8e2662c971b5ccdf451f224f333a4b04';

interface TTSRecorderProps {
    speed?: number,
    voice?: number,
    pitch?: number,
    engineType?: string,
    voiceName?: string,
    text?: string,
    tte?: string,
}
const worker = new TransWorker();

class AudioPlayer {
    offset = 0;
    context: any = null;
    onended: any = null;
    bufferSource: any = null;

    constructor() {
        // @ts-ignore
        const Context = window.AudioContext || window.webkitAudioContext;
        if (Context) {
            this.context = new Context();
            this.context.resume();
            this.offset = 0;
        }
    }

    play(audio: any) {
        this.offset += audio.length;
        const buffer = this.context.createBuffer(1, audio.length, 22050);
        const now = buffer.getChannelData(0);
        if (buffer.copyToChannel) {
            buffer.copyToChannel(new Float32Array(audio), 0, 0);
        } else {
            for (let i = 0, len = audio.length; i < len; i++) {
                now[i] = audio[i]
            }
        }
        const bufferSource = this.context.createBufferSource();
        bufferSource.buffer = buffer;
        bufferSource.connect(this.context.destination);
        bufferSource.start();
        bufferSource.onended = this.onended;
        this.bufferSource = bufferSource;
    }

    stop() {
        this.offset = 0;
        if (this.bufferSource) {
            try {
                this.bufferSource.stop();
            } catch (e) {
                console.log(e);
            }
        }
    }

    reset() {
        this.stop();
        this.offset = 0;
    }
}


class TTSRecorder {

    props: TTSRecorderProps;
    worker: any;

    audio: any[] = [];
    rawAudio: any[] = [];
    // @ts-ignore
    socket: WebSocket = null;
    audioContext : AudioPlayer;

    constructor(props: TTSRecorderProps) {
        this.props = props;
        this.audioContext = new AudioPlayer();
        this.audioContext.onended = this.onAudioEnded;
        worker.onmessage = ({ data }: any) => {
            if (data.audio) {
                this.audio.push(data.audio);
            }
            if (data.rawAudio) {
                this.rawAudio.push(data.rawAudio);
            }
        }
    }

    get url() {
        const url = 'wss://tts-api.xfyun.cn/v2/tts';
        const host = location.host;
        const date = new Date().toUTCString();
        const algorithm = 'hmac-sha256';
        const headers = 'host date request-line';
        const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/tts HTTP/1.1`;
        const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, API_SECRET);
        const signature = CryptoJS.enc.Base64.stringify(signatureSha);
        const authorizationOrigin = `api_key="${API_KEY}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
        const authorization = btoa(authorizationOrigin);
        return `${url}?authorization=${authorization}&date=${date}&host=${host}`;
    }

    encodeText(text: string, encoding: string): any {
        switch (encoding) {
            case 'utf16le':
                const buf = new ArrayBuffer(text.length * 4);
                const bufv = new Uint16Array(buf);
                for (let i = 0, len = text.length; i< len; i += 1) {
                    bufv[i] = text.charCodeAt(i);
                }
                return buf;
            case 'buffer2Base64':
                let binary = '';
                const bytes = new Uint8Array(text as any);
                const len = bytes.byteLength;
                for (let i = 0; i < len; i += 1) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return window.btoa(binary);
            case 'base64&utf16le':
                return this.encodeText(this.encodeText(text, 'utf16le'), 'buffer2Base64');
            default:
                return Base64.encode(text);
        }
    }

    send(text: string) {
        const params = {
            common: { app_id: APPID },
            business: {
                aue: 'raw',
                auf: 'audio/L16;rate=16000',
                bgs: 1,
                tte: this.props.tte || 'UTF8',
                ent: this.props.engineType || 'intp65',
                vcn: this.props.voiceName || 'xiaoyan',
                speed: this.props.speed || 50,
                volume: this.props.voice || 50,
                pitch: this.props.pitch || 50,
            },
            data: {
                status: 2,
                text: this.encodeText(text, this.props.tte === 'unicode' ? 'base64&utf16le' : ''),
            },
        };
        this.socket.send(JSON.stringify(params));
    }

    run() {
        if ('WebSocket' in window) {
            this.socket = new WebSocket(this.url);
        } else if ('MozWebSocket' in window){
            // @ts-ignore
            this.socket = new MozWebSocket(this.url);
        } else {
            return alert('不支持websocket');
        }
        // websocket打开
        this.socket.onopen = () => {
            this.send('杨威是个大傻逼');
            setTimeout(this.onAudioEnded, 1000);
        }
        this.socket.onmessage = ({ data }) => {
            let jsonData = JSON.parse(data);
            // 合成失败
            if (jsonData.code !== 0) {
                alert(`合成失败: ${jsonData.code}:${jsonData.message}`);
                this.audioContext.reset();
                this.socket.close();
                return;
            }
            worker.postMessage(jsonData.data.audio);

            if (jsonData.code === 0 && jsonData.data.status === 2) {
                this.socket.close();
            }
        }
    }

    onAudioEnded = () => {
        console.log(this.audio);
        if (this.audioContext.offset < this.audio.length) {
            const data = this.audio.slice(this.audioContext.offset);
            this.audioContext.play(data);
        } else {
            this.audioContext.stop();
        }
    }

}

export default TTSRecorder;