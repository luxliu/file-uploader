import { generateKey, encryptFile, toBase64 } from './encrypt.util';

// const mockUploadFile = (file, onprogress) =>
//   new Promise((resolve, reject) => {
//     const key = generateKey();
//     const fileReader = new FileReader();

//     fileReader.onprogress = onprogress;
//     fileReader.onerror = () =>
//       reject({ status: 500, message: 'Uploading is failed!' });
//     fileReader.onload = (event) => {
//       const encrypted = encryptFile(event.currentTarget.result, key);
//       // encrypted is for real ajax request
//       resolve({ status: 200, message: 'Uploading success!' });
//     };
//     fileReader.readAsDataURL(file);
//   });

const uploadFile = (file, onprogress, url, password) =>
  new Promise(async function (resolve, reject) {
    const key = generateKey();
    const base64String = await toBase64(file);
    const encrypted = encryptFile(base64String, key);
    const formData = new FormData();
    formData.append('encryptedFile', encrypted);
    formData.append('password', password);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = onprogress;
    xhr.upload.onload = () =>
      resolve({ status: 200, response: 'Uploading success!' });
    xhr.upload.onerror = () =>
      reject({ status: 500, response: 'Uploading is failed!' });
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'multipart/form-data');
    xhr.setRequestHeader('X_FILE_NAME', file.name);
    xhr.send(formData);
  });

export { uploadFile };
