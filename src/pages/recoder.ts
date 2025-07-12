import Recorder, { type SampleDataResult } from 'recorder-core';
Recorder.i18n = {
  default: {}
}
import 'recorder-core/src/engine/pcm';
import 'recorder-core/src/extensions/wavesurfer.view';

type AudioChunk = {
  pcm: Int16Array;
  pcmSampleRate: number;
  offset?: number;
};

type RecorderCallback = (blob: Blob, encTime: number) => void;

interface RecorderControls {
  recStart: () => void;
  recStop: () => void;
}

export const createRecorder = (callback: RecorderCallback): RecorderControls => {
  const SAMPLE_RATE = 16000;
  const BIT_RATE = 16;
  const FRAME_SIZE = 1280;

  // 状态管理
  let chunks: AudioChunk[] | null = null;
  let previousChunk: SampleDataResult | null = null;
  let recorderInstance: InstanceType<typeof Recorder> | null = null;

  const processAudioFrame = (
    buffers: Float32Array[],
    bufferSampleRate: number,
    isFinal: boolean
  ): void => {
    if (!buffers.length && !isFinal) return;

    const chunk = Recorder.SampleData(
      buffers,
      bufferSampleRate,
      SAMPLE_RATE,
      previousChunk,
      { frameType: BIT_RATE === 16 ? 'short' : 'byte' }
    );

    // 清理已处理的缓冲区
    if (previousChunk) {
      for (let i = 0; i < chunk.index - 3; i++) {
        buffers[i] = null!;
      }
    }

    previousChunk = chunk;

    if (chunk.data.length > 0) {
      chunks = chunks || [];
      chunks.push({
        pcm: chunk.data,
        pcmSampleRate: chunk.sampleRate
      });
    }

    sendAudioFrames(isFinal);
  };

  const sendAudioFrames = (isFinal: boolean): void => {
    if (!chunks) return;

    const frameSize = FRAME_SIZE / (BIT_RATE / 8);
    const frameBuffer = new Int16Array(frameSize);

    let framePos = 0;
    const chunksToKeep: AudioChunk[] = [];

    for (const chunk of chunks) {
      const startPos = chunk.offset || 0;
      const availableSamples = chunk.pcm.length - startPos;
      const neededSamples = frameSize - framePos;

      const copyCount = Math.min(availableSamples, neededSamples);
      frameBuffer.set(
        chunk.pcm.subarray(startPos, startPos + copyCount),
        framePos
      );

      framePos += copyCount;
      chunk.offset = startPos + copyCount;

      if (chunk.offset < chunk.pcm.length) {
        chunksToKeep.push(chunk);
      }

      if (framePos === frameSize) break;
    }

    chunks = framePos === frameSize ? chunksToKeep : null;

    if (framePos === frameSize || isFinal) {
      encodeAndSendFrame(frameBuffer.subarray(0, framePos), isFinal);
    }
  };

  const encodeAndSendFrame = (pcmData: Int16Array, isFinal: boolean): void => {
    const encodeStart = Date.now();
    const encoder = new Recorder({
      type: 'pcm',
      sampleRate: SAMPLE_RATE,
      bitRate: BIT_RATE
    });

    encoder.mock(pcmData, SAMPLE_RATE);
    encoder.stop(
      (blob, duration) => {
        callback(blob, Date.now() - encodeStart);
        if (!isFinal && chunks) {
          sendAudioFrames(false);
        }
      },
      (error) => console.error('Encoding failed:', error)
    );
  };

  const startRecording = (): void => {
    if (recorderInstance) recorderInstance.close();

    recorderInstance = new Recorder({
      type: 'unknown',
      onProcess: (buffers, _, __, sampleRate) => {
        processAudioFrame(buffers, sampleRate, false);
      }
    });

    recorderInstance.open(
      () => {
        chunks = null;
        previousChunk = null;
        recorderInstance?.start();
      },
      (error, isUserDenied) => {
        console.error(isUserDenied ? '用户拒绝访问麦克风' : '录音初始化失败:', error);
      }
    );
  };

  const stopRecording = (): void => {
    recorderInstance?.close();
    processAudioFrame([], SAMPLE_RATE, true);
  };

  return {
    recStart: startRecording,
    recStop: stopRecording
  };
};
