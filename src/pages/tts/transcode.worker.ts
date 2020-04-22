const transcode = {
    transToAudioData: function(audio: string, fromRate = 16000, toRate = 22505) {
        const outS16 = transcode.base64ToS16(audio);
        let output = transcode.transS16ToF32(outS16);
        output = transcode.transSamplingRate(output, fromRate, toRate);
        return [Array.from(outS16), Array.from(output)];
    },
    transSamplingRate: function(buffer: Float32Array, fromRate = 44100, toRate = 16000) {
        const fitCount = Math.round(buffer.length * (toRate / fromRate));
        const newData = new Float32Array(fitCount);
        const springFactor = (buffer.length - 1) / (fitCount - 1);
        newData[0] = buffer[0];
        for (let i = 0; i < fitCount; i += 1) {
            const factor = i * springFactor;
            const before = +Math.floor(factor).toFixed();
            const after = +Math.ceil(factor).toFixed();
            const diff = factor - before;
            newData[i] = buffer[before] + (buffer[after] - buffer[before]) * diff;
        }
        newData[fitCount - 1] = buffer[buffer.length - 1];
        return newData;
    },
    transS16ToF32: function(buffer: Int16Array) {
        const data = [];
        for (let i = 0, len = buffer.length; i < len; i += 1) {
            const d = buffer[i] < 0 ? buffer[i] / 0x8000 : buffer[i] / 0x7fff;
            data.push(d);
        }
        return new Float32Array(data);
    },
    base64ToS16: function (encode: string) {
        encode = atob(encode);
        const output = new Uint8Array(encode.length);
        for (let i = 0, len = output.length; i < len; i += 1) {
            output[i] = encode.charCodeAt(i);
        }
        return new Int16Array(new DataView(output.buffer).buffer);
    }
};

const ctx: Worker = self as any;
ctx.onmessage = function({ data }) {
    const [rawAudio, audio] = transcode.transToAudioData(data);
    ctx.postMessage({ rawAudio, audio });
}






