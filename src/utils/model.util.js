import { uploadFile } from './api.util.js';

class FileUploader {
  constructor(
    file,
    progressBarWrapperId,
    fileNameLabelId,
    fileInputId,
    uploadFileButtonId
  ) {
    this._file = file;
    this._progressBarWrapperId = progressBarWrapperId;
    this._fileNameLabelId = fileNameLabelId;
    this._fileInputId = fileInputId;
    this._uploadFileButtonId = uploadFileButtonId;
  }

  onBrowserFile(fileList) {
    const fileNameLabel = document.getElementById(this._fileNameLabelId);
    const uploadFileButton = document.getElementById(this._uploadFileButtonId);
    fileNameLabel.innerHTML = null;
    uploadFileButton.disabled = true;

    this._file = Array.from(fileList)[0];
    if (!this._file) return;

    fileNameLabel.innerHTML = this._file.name;
    uploadFileButton.disabled = false;
  }

  appendProgressBar() {
    const date = new Date();
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;
    const progressBarId = `${date.getTime()}-${this._file.name}`;
    const progressContentHtml = `
      <div class="row content">
          <div class="col-2">${formattedDate}</div>
          <div class="col-4 name">${this._file.name}</div>
          <div class="col-6 progress-bar-wrapper">
              <div class="progress">
                <div
                    class="progress-bar bg-success"
                    id="${progressBarId}"
                    role="progressbar"
                    style="width: 0;"
                ></div>
              </div>
              <div class="icon-wrapper">
                <img src="src/assets/images/tick.png" id="${progressBarId}-tick-icon" class="icon"/>
                <img src="src/assets/images/reupload.png" id="${progressBarId}-reupload-icon" class="icon"/>
              </div>
          </div>
      </div>
    `;
    document
      .getElementById(this._progressBarWrapperId)
      .insertAdjacentHTML('beforeend', progressContentHtml);

    return progressBarId;
  }

  onUploadClick() {
    if (!this._file) return;

    const alert = document.getElementById('alert');
    alert.style.display = 'none';

    if (this._file.size > 20 * 1024 * 1024) {
      alert.innerText = 'Please select a file which is smaller than 20Mb.';
      alert.style.display = 'block';
      alert.className = 'alert alert-danger';
      return;
    }

    const progressBarId = this.appendProgressBar();

    const progressBar = document.getElementById(progressBarId);
    const tickIcon = document.getElementById(`${progressBarId}-tick-icon`);
    const reuploadIcon = document.getElementById(
      `${progressBarId}-reupload-icon`
    );

    const onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = parseInt((event.loaded / event.total) * 100, 10);
        progressBar.style.width = `${progress}%`;
      }
    };
    const onerror = (resp) => {
      progressBar.style.width = '100%';
      progressBar.className = 'progress-bar bg-danger';
      reuploadIcon.style.display = 'block';
      console.log(resp);
    };
    const onload = (resp) => {
      tickIcon.style.display = 'block';
      console.log(resp);
    };

    const password = document.getElementById('password').value;
    console.log(password);

    uploadFile(
      this._file,
      onprogress,
      'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      password
    )
      .then(onload)
      .catch(onerror);
  }
}

export default FileUploader;
