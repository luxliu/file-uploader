// https://github.com/dchest/tweetnacl-js/wiki/Examples

import { secretbox, randomBytes } from 'tweetnacl';
import { decodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

const newNonce = () => randomBytes(secretbox.nonceLength);

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => resolve(reader.result));
    reader.addEventListener('error', (error) => reject(error));
    reader.readAsDataURL(file);
  });

export const generateKey = () => encodeBase64(randomBytes(secretbox.keyLength));

export const encryptFile = (base64Part, key) => {
  const keyUint8Array = decodeBase64(key);
  const nonce = newNonce();
  const messageUint8 = decodeUTF8(base64Part);
  const box = secretbox(messageUint8, nonce, keyUint8Array);
  const fullMessage = new Uint8Array(nonce.length + box.length);
  fullMessage.set(nonce);
  fullMessage.set(box, nonce.length);

  const base64FullMessage = encodeBase64(fullMessage);
  return base64FullMessage;
};
