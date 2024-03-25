import {
  deleteUser,
  updateUsername,
  updateProfilePhoto,
  reauthenticateUser
} from '../external/firebase.js';

export class UserEditor {
  die() {
    window.location.replace('/login.html');
  }
  
  hasUser() {
    return !!this.user;
  }
  
  init(user, details, components) {
    this.user = user;
    this.userDetails = details;
    this.components = components;
    
    this.components.ui.username.html(this.userDetails.name);
    this.components.ui.image.attr('src', this.userDetails.photo);
    this.components.ui.forms.hide();
    this.components.ui.visibleForms.show();
    this.components.ui.loading.hide();
    
    this.initNameForm();
    this.initPhotoForm();
    this.initDeleteForm();
  }
  
  initNameForm() {
    this.components.name.form.submit(e => {
      e.preventDefault();
      
      const first = this.components.name.first.val();
      const last = this.components.name.last.val();
      
      this.updateName(first, last);
    });
  }
  
  updateName(first, last) {
    if (!first) {
      this.components.name.errors.first.html('Please enter a first name');
    }
    
    if (!last) {
      this.components.name.errors.last.html('Please enter a last name');
    }
    
    if (!first || !last) {
      return;
    }
      
    const validName = /^[a-zA-Z0-9.,\- ]+$/;
    
    if (!validName.test(first) || !validName.test(last)) {
      this.components.name.errors.first.html('Please enter an alphanumerical name');
      this.components.name.errors.last.html('Please enter an alphanumerical name');
      
      return;
    }
    
    updateUsername(this.user, first, last, () => {
      window.location.replace('/user.html');
    });
  }
  
  initPhotoForm() {
    this.components.photo.form.change(e => {
      const input = e.target;
      
      if (!(input.files && input.files[0])) {
        return;
      }
      
      const file = input.files[0];
      
      try {
        const reader = new FileReader();
        
        $(reader).on('load', e => {
          const data = e.target.result;
          
          this.processProfileImage(data);
        });
        
        reader.readAsDataURL(file);
      } catch (e) {
        this.components.photo.error.html('OOPS! An error occurred');
        console.error(e);
      }
    });
  }
  
  processProfileImage(data) {
    const canvas = $('<canvas>')[0];
    const context = canvas.getContext('2d');
    
    const image = new Image();
    image.src = data;
    
    const size = 128;
    
    $(image).on('load', () => {
      canvas.width = size;
      canvas.height = size;
      
      const min = Math.min(image.width, image.height);
      const x = (image.width - min) / 2;
      const y = (image.height - min) / 2;
      
      context.drawImage(image, x, y, min, min, 0, 0, size, size);
      
      const data = canvas.toDataURL('image/png');
      
      updateProfilePhoto(this.user, data).then(() => {
        window.location.replace('/user.html');
      });
    });
  }
  
  initDeleteForm() {
    this.components.delete.submit.click(e => {
      e.preventDefault();
      
      reauthenticateUser(this.user, this.components.delete.password.val())
        .then(() => this.deleteUserSuccess())
        .catch(() => this.deleteUserError());
    });
    
    this.initDeleteTrigger();
  }
  
  deleteUserSuccess() {
    this.components.delete.error.removeClass('text-warning');
    this.components.delete.error.addClass('text-success');
    this.components.delete.error.html('Your Account Is Being Deleted. Please Do NOT Close The Window!...');
    this.components.delete.submit.unbind();
    
    deleteUser(this.user);
  }
  
  deleteUserError() {
    this.components.delete.error.removeClass('text-success');
    this.components.delete.error.addClass('text-warning');
    this.components.delete.error.html('Incorrect Password. Page Reloading...');
    this.components.delete.submit.unbind();
    
    window.setTimeout(() => {
      window.location.replace('/user.html');
    });
  }
  
  initDeleteTrigger() {
    this.components.delete.trigger.click(() => {
      this.components.delete.modal.css({
        display: 'flex',
        opacity: 0,
        transition: '.4s'
      });
      
      window.setTimeout(() => {
        this.components.delete.modal.css('opacity', 1);
      });
    });
  }
}
