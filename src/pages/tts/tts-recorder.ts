import CryptoJS from 'crypto-js';
import { Base64 } from 'js-base64'

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
        }
    }

    play(audio: any) {
        const that = this;
        this.context.decodeAudioData(audio, function (buffer: any) {
            const bufferSource = that.context.createBufferSource();
            bufferSource.buffer = buffer;
            bufferSource.connect(that.context.destination);
            bufferSource.start(0);
            bufferSource.onended = that.onended;
        });
    }

    stop() {
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
                aue: 'lame',
                sfl: 1,
                auf: 'audio/L16;rate=16000',
                tte: this.props.tte || 'UTF8',
                vcn: this.props.voiceName || 'aisjiuxu',
                speed: 50,
            },
            data: {
                status: 2,
                text: Base64.encode(text),
            },
        };
        this.socket.send(JSON.stringify(params));
    }

    run(text: string, callback: (base64: string) => void) {
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
            this.send(text);
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

            if (jsonData.code === 0 && jsonData.data.status === 2) {
                this.socket.close();
                callback && callback(jsonData.data.audio);
            }
        }
    }


    onDownload = (content: string) => {
        const $el = document.createElement('a');
        $el.download = 'mp3.txt';
        $el.style.display = 'none';
        
        const blob = new Blob([content]);
        $el.href = URL.createObjectURL(blob);

        document.body.appendChild($el);
        $el.click();
        document.body.removeChild($el);
    }

    onParseVoice = (content: string) => {
        // 播放MP3
        const bytes = window.atob(content);
        const abytes = new ArrayBuffer(bytes.length);
        const arr = new Uint8Array(abytes);
        for (let i = 0, len = bytes.length; i < len; i += 1) {
            arr[i] = bytes.charCodeAt(i) & 0xFF;
        }
        this.audioContext.play(abytes);
    }

}

export default TTSRecorder;