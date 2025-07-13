import CryptoJS from 'crypto-js';

let resultText = "";
let resultTextTemp = "";

export function getWebSocketUrl(): string {
  const url = "wss://iat-api.xfyun.cn/v2/iat";
  const host = "iat-api.xfyun.cn";
  const apiKey = "d98ad0cb6bfd95a28eefd794415cc48f";
  const apiSecret = "OTdmNzliNjVlNjdmZjA1NmI4MzU1YjFj";
  const date = new Date().toUTCString();
  const algorithm = "hmac-sha256";
  const headers = "host date request-line";

  const signatureOrigin = `host: ${host}\ndate: ${date}\nGET /v2/iat HTTP/1.1`;
  const signatureSha = CryptoJS.HmacSHA256(signatureOrigin, apiSecret);
  const signature = CryptoJS.enc.Base64.stringify(signatureSha);

  const authorizationOrigin = `api_key="${apiKey}", algorithm="${algorithm}", headers="${headers}", signature="${signature}"`;
  const authorization = btoa(authorizationOrigin);

  return `${url}?authorization=${authorization}&date=${encodeURIComponent(date)}&host=${host}`;
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function processRecognitionResult(resultData: string): string {
  try {
    const jsonData = JSON.parse(resultData);
    if (jsonData.data?.result) {
      const data = jsonData.data.result;
      let str = "";
      const ws = data.ws;

      for (let i = 0; i < ws.length; i++) {
        str += ws[i].cw[0].w;
      }

      if (data.pgs) {
        if (data.pgs === "apd") {
          resultText = resultTextTemp;
        }
        resultTextTemp = resultText + str;
      } else {
        resultText += str;
      }

      return resultTextTemp || resultText || "";
    }
  } catch (e) {
    console.error("解析识别结果失败:", e);
  }
  return "";
}

export function resetRecognitionResult(): void {
  resultText = "";
  resultTextTemp = "";
}
