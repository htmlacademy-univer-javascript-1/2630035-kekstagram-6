import { resetEditor } from './image-editor.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './messages.js';
import { isEscapeKey } from './util.js';

const uploadForm = document.querySelector('#upload-select-image');
const uploadFileInput = uploadForm.querySelector('#upload-file');
const uploadOverlay = uploadForm.querySelector('.img-upload__overlay');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const commentInput = uploadForm.querySelector('.text__description');
const uploadSubmitButton = uploadForm.querySelector('#upload-submit');
const uploadPreview = uploadForm.querySelector('.img-upload__preview img');
const effectsPreview = uploadForm.querySelectorAll('.effects__preview');
const scaleControl = uploadForm.querySelector('.scale__control--value');
const effectLevel = uploadForm.querySelector('.effect-level__value');
const body = document.body;

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error'
}, true);

const createProcessedImage = async (imageElement) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const computedStyle = window.getComputedStyle(imageElement);
        const transform = computedStyle.transform;
        const filter = computedStyle.filter;
        
        let scaleValue = 1;
        if (transform && transform !== 'none') {
          const matrixMatch = transform.match(/matrix\(([^)]+)\)/);
          if (matrixMatch) {
            const values = matrixMatch[1].split(',').map(Number);
            if (values.length >= 4) {
              scaleValue = values[0];
            }
          }
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const newWidth = img.naturalWidth * scaleValue;
        const newHeight = img.naturalHeight * scaleValue;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        if (filter && filter !== 'none') {
          ctx.filter = filter;
        }
        
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Не удалось создать изображение'));
            return;
          }
          
          const originalFile = uploadFileInput.files[0];
          const fileName = originalFile ? originalFile.name : 'image.jpg';
          const file = new File([blob], fileName, { type: 'image/jpeg' });
          
          const processedUrl = URL.createObjectURL(blob);
          resolve({
            url: processedUrl,
            file: file,
            scale: scaleValue * 100
          });
        }, 'image/jpeg', 0.95);
        
      } catch (error) {
        reject(error);
      }
    };
    
    img.onerror = () => {
      reject(new Error('Не удалось загрузить изображение'));
    };
    
    img.src = imageElement.src;
  });
};

const validateHashtags = (value) => {
  if (value.trim() === '') {
    return true;
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);

  if (hashtags.length > 5) {
    return false;
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (const hashtag of hashtags) {
    if (!hashtagRegex.test(hashtag)) {
      return false;
    }
  }

  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);

  if (uniqueHashtags.size !== hashtags.length) {
    return false;
  }

  return true;
};

const getHashtagError = (value) => {
  if (value.trim() === '') {
    return '';
  }

  const hashtags = value.trim().split(/\s+/).filter(Boolean);

  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  const hashtagRegex = /^#[a-zа-яё0-9]{1,19}$/i;

  for (const hashtag of hashtags) {
    if (!hashtagRegex.test(hashtag)) {
      return 'Хэш-тег должен начинаться с # и содержать только буквы и цифры (1-19 символов)';
    }
  }

  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  const uniqueHashtags = new Set(lowerCaseHashtags);

  if (uniqueHashtags.size !== hashtags.length) {
    return 'Хэш-теги не должны повторяться';
  }

  return '';
};

const validateComment = (value) => {
  return value.length <= 140;
};

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  getHashtagError
);

pristine.addValidator(
  commentInput,
  validateComment,
  'Длина комментария не может составлять больше 140 символов'
);

const showFileError = (message) => {
  const errorElement = document.createElement('div');
  errorElement.style.position = 'fixed';
  errorElement.style.top = '50%';
  errorElement.style.left = '50%';
  errorElement.style.transform = 'translate(-50%, -50%)';
  errorElement.style.backgroundColor = '#ff4e4e';
  errorElement.style.color = '#ffffff';
  errorElement.style.padding = '20px';
  errorElement.style.borderRadius = '5px';
  errorElement.style.zIndex = '1000';
  errorElement.style.fontFamily = 'Arial, sans-serif';
  errorElement.textContent = message;

  document.body.appendChild(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, 3000);
};

const loadAndShowPhoto = (file) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showFileError('Недопустимый формат файла. Используйте JPEG, PNG, GIF или WebP.');
    return false;
  }

  if (file.size > MAX_FILE_SIZE) {
    showFileError('Файл слишком большой. Максимальный размер: 5 МБ.');
    return false;
  }

  const reader = new FileReader();

  reader.onload = (evt) => {
    uploadPreview.src = evt.target.result;

    effectsPreview.forEach((preview) => {
      preview.style.backgroundImage = `url(${evt.target.result})`;
    });
  };

  reader.onerror = () => {
    showFileError('Ошибка чтения файла. Попробуйте выбрать другой файл.');
  };

  reader.readAsDataURL(file);
  return true;
};

const onFileInputChange = () => {
  const file = uploadFileInput.files[0];

  if (file) {
    const success = loadAndShowPhoto(file);
    if (success) {
      resetEditor();
      openUploadForm();
    } else {
      uploadFileInput.value = '';
    }
  }
};

const blockSubmitButton = () => {
  uploadSubmitButton.disabled = true;
  uploadSubmitButton.textContent = 'Отправляю...';
};

const unblockSubmitButton = () => {
  uploadSubmitButton.disabled = false;
  uploadSubmitButton.textContent = 'Опубликовать';
};

const resetForm = () => {
  uploadForm.reset();
  uploadFileInput.value = '';
  uploadPreview.src = 'img/upload-default-image.jpg';

  effectsPreview.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  pristine.reset();
  resetEditor();
};

let updatePhotosCallback = null;

const addNewPhotoToGallery = (photoData) => {
  if (updatePhotosCallback && typeof updatePhotosCallback === 'function') {
    updatePhotosCallback(photoData);
  }
};

const openUploadForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  uploadCancel.addEventListener('click', onCancelClick);
  uploadForm.addEventListener('submit', onFormSubmit);

  hashtagInput.addEventListener('keydown', onInputKeydown);
  commentInput.addEventListener('keydown', onInputKeydown);
};

const closeUploadForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');

  resetForm();

  document.removeEventListener('keydown', onDocumentKeydown);
  uploadCancel.removeEventListener('click', onCancelClick);
  uploadForm.removeEventListener('submit', onFormSubmit);
  hashtagInput.removeEventListener('keydown', onInputKeydown);
  commentInput.removeEventListener('keydown', onInputKeydown);
};

const getCurrentEffect = () => {
  const checkedEffect = uploadForm.querySelector('input[name="effect"]:checked');
  return checkedEffect ? checkedEffect.value : 'none';
};

const getCurrentEffectLevel = () => {
  return effectLevel.value || '';
};

const getCurrentScale = () => {
  return scaleControl.value.replace('%', '');
};

const onFormSubmit = async (evt) => {
  evt.preventDefault();

  if (!uploadFileInput.files || uploadFileInput.files.length === 0) {
    showFileError('Пожалуйста, выберите фотографию для загрузки.');
    return;
  }

  const isValid = pristine.validate();

  if (!isValid) {
    return;
  }

  blockSubmitButton();

  try {
    const processedImage = await createProcessedImage(uploadPreview);
    
    const formData = new FormData();
    
    formData.append('filename', processedImage.file);
    formData.append('scale', processedImage.scale);
    formData.append('effect', getCurrentEffect());
    
    const currentEffect = getCurrentEffect();
    if (currentEffect !== 'none') {
      const effectLevelValue = getCurrentEffectLevel();
      if (effectLevelValue) {
        formData.append('effect_level', effectLevelValue);
      }
    }
    
    const descriptionValue = commentInput.value.trim();
    const hashtagsValue = hashtagInput.value.trim();
    
    if (descriptionValue) {
      formData.append('description', descriptionValue);
    }
    
    if (hashtagsValue) {
      formData.append('hashtags', hashtagsValue);
    }
    
    await sendData(formData);

    const newPhoto = {
      id: Date.now(),
      url: processedImage.url,
      description: descriptionValue || 'Новое фото',
      likes: 0,
      comments: [],
      scale: processedImage.scale,
      effect: getCurrentEffect(),
      effect_level: getCurrentEffectLevel()
    };

    addNewPhotoToGallery(newPhoto);

    showSuccessMessage();

    closeUploadForm();

    unblockSubmitButton();

  } catch (error) {
    console.error('Ошибка при отправке формы:', error);
    showErrorMessage(() => {
      uploadOverlay.classList.remove('hidden');
      body.classList.add('modal-open');
      unblockSubmitButton();
    });
  }
};


const onCancelClick = () => {
  closeUploadForm();
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !hashtagInput.matches(':focus') && !commentInput.matches(':focus')) {
    evt.preventDefault();
    closeUploadForm();
  }
};

const onInputKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.stopPropagation();
  }
};

const initForm = (callback) => {
  updatePhotosCallback = callback;
  uploadFileInput.addEventListener('change', onFileInputChange);
};

export { initForm, closeUploadForm };