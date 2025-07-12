// src/types/recorder.d.ts

declare module 'recorder-core' {
  export interface SampleDataResult {
    data: Int16Array;
    sampleRate: number;
    index: number;
  }

  export interface RecorderConfig {
    type: string;
    sampleRate?: number;
    bitRate?: number;
    onProcess?: (
      buffers: Float32Array[],
      powerLevel: number,
      bufferDuration: number,
      bufferSampleRate: number
    ) => void;
  }

  export class Recorder {
    constructor(config: RecorderConfig);
    static CLog: () => void;
    static SampleData: (
      buffers: Float32Array[],
      sampleRate: number,
      newSampleRate: number,
      prevChunk?: SampleDataResult,
      options?: { frameType: 'short' | 'byte' }
    ) => SampleDataResult;
    mock(data: Int16Array, sampleRate: number): void;
    stop(
      success?: (blob: Blob, duration: number) => void,
      fail?: (msg: string) => void
    ): void;
    close(): void;
    open(
      success: () => void,
      fail?: (msg: string, isUserNotAllow: boolean) => void
    ): void;
    start(): void;
  }

  // 导出所有类型
  export { SampleDataResult, RecorderConfig };
}

// 全局类型导出（可选）
export interface RecorderCore {
  SampleDataResult: {
    data: Int16Array;
    sampleRate: number;
    index: number;
  };
  Recorder: typeof import('recorder-core').Recorder;
}

// 确保模块导出
export {};
