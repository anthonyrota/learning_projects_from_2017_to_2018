class DownloadManager {
  constructor (renderer, parent) {
    this.renderer = renderer;
    this.parent = parent;
    
    this.supportedTypes = ['png', 'jpeg'];
    
    this.qualitySlider = $('#file-quality');
    this.qualityValue = $('#file-quality-value');
    
    this.fileType = $('#file-type');
    this.fileName = $('#file-name');
    
    this.downloadTrigger = $('#download-image');
    
    this.modal = $('#download-modal');
    this.openModal = $('.download-button');
    this.closeModal = $('#close-download-modal');
    
    this.bindEvents();
  }
  
  bindEvents() {
    this.qualitySlider.on('change', () => {
      this.qualityValue.html(this.qualitySlider.val());
    });
    
    this.fileType.on('blur', () => {
      this.checkIfSupported(this.fileType.val());
    });
    
    this.downloadTrigger.click(this.download.bind(this));
    
    this.openModal.click(() => {
      this.modal.addClass('show');
    });
    
    this.closeModal.click(this.close.bind(this));
  }
  
  close() {
    this.modal.removeClass('show');
  }
  
  checkIfSupported(type) {
    const possible = this.supportedTypes;
    let supported = false;
    
    for (let i = 0; i < possible.length; i++) {
      if (type === possible[i]) {
        supported = true;
      }
    }
    
    if (!supported) {
      this.fileType.val('png');
      
      const len = possible.length;
      let str = '';
      
      for (let i = 0; i < len - 2; i++) {
        str += `${possible[i]}, `;
      }
      
      str += `${possible[len - 2]} or ${possible[len - 1]}`;
      
      swal('That filetype isn\'t supported', `Try ${str}`, 'error', {
        customClass: 'swal'
      });
      
      return false;
    }
    
    return true;
  }
  
  trimName(name, ext) {
    const dotIndex = name.lastIndexOf('.');
    
    if (dotIndex === -1) {
      return name + '.' + ext;
    }
    
    const nameExt = name.substr(dotIndex + 1);
    
    if (nameExt === ext) {
      return name;
    }
    
    return name + '.' + ext;
  }
  
  download() {
    if (!this.parent.hadImage()) {
      swal('There was no image to download', 'You musn\'t have chosen an image, or it hasn\'t loaded, try filtering first!', 'error');
      this.close();
      return;
    }
    
    const canvas = this.renderer.extract.canvas(this.renderer._lastObjectRendered);
    
    if (canvas.width <= 0 || canvas.height <= 0) {
      swal('The image width or height is 0!', 'Please choose another image', 'error');
      this.close();
      return;
    }
    
    let type = this.fileType.val();
    let name = this.fileName.val();
    let quality = this.qualitySlider.val();
    
    if (!this.checkIfSupported(type)) {
      return;
    }
    
    if (name === '') {
      name = 'image';
      this.fileName.val(name);
    }
    
    name = this.trimName(name, type);
    
    type = `image/${type}`;
    console.log(this.renderer._lastObjectRendered);
    
    const data = canvas.toDataURL(type, Number(quality));
    
    download(data, name, type);
  }
}