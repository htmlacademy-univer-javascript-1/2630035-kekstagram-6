import { renderPictures, clearPictures } from './pictures.js';
import { initFullscreen } from './fullscreen.js';
import { initForm, closeUploadForm } from './form.js';
import { initImageEditor } from './image-editor.js';
import { loadData } from './api.js';
import { showAlert } from './messages.js';
import { Filters } from './filters.js';

let photos = [];
let filters = null;

const onFilterChange = (filteredPhotos) => {
  clearPictures();
  renderPictures(filteredPhotos);
  initFullscreen(filteredPhotos);
};

const updatePhotos = (newPhoto) => {
  photos.unshift(newPhoto);

  if (filters) {
    filters.destroy();
  }
  filters = new Filters();
  filters.init(photos, onFilterChange);

  onFilterChange(photos);
};

const loadPhotos = async () => {
  try {
    photos = await loadData();

    renderPictures(photos);
    initFullscreen(photos);

    filters = new Filters();
    filters.init(photos, onFilterChange);

    initForm(updatePhotos);

  } catch (error) {
    showAlert(error.message);
    console.error('Ошибка загрузки фотографий:', error);
  }
};

const initApp = () => {
  loadPhotos();
  initImageEditor();
};

document.addEventListener('click', (evt) => {
  if (evt.target.closest('.success__button')) {
    closeUploadForm();
  }
});

initApp();

const cleanup = () => {
  if (filters) {
    filters.destroy();
  }
};

export { photos, cleanup };

