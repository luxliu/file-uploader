import 'bootstrap/dist/css/bootstrap.min.css';

import './main.scss';

import FileUploader from './utils';

const fileUploader = new FileUploader(
  null,
  'progress-display',
  'file-name-label',
  'file-input',
  'upload-file-button'
);

window.fileUploader = fileUploader;
