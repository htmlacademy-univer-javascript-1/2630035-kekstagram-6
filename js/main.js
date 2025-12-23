import { renderPictures, clearPictures } from './pictures.js';
import { initFullscreen } from './fullscreen.js';
import { initForm } from './form.js';
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

const loadPhotos = async () => {
  try {
    photos = await loadData();

    renderPictures(photos);

    initFullscreen(photos);

    filters = new Filters();
    filters.init(photos, onFilterChange);

  } catch (error) {
    showAlert(error.message);
    console.error('Ошибка загрузки фотографий:', error);
  }
};

const initApp = () => {

  loadPhotos();

  initForm();

  initImageEditor();
};

initApp();

const cleanup = () => {
  if (filters) {
    filters.destroy();
  }
};

export { photos, cleanup };
