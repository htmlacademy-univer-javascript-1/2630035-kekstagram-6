import { renderPictures } from './pictures.js';
import { initFullscreen } from './fullscreen.js';
import { initForm } from './form.js';
import { initImageEditor } from './image-editor.js';
import { loadData } from './api.js';
import { showAlert } from './messages.js';
import { debounce } from './util.js';

const imgFilters = document.querySelector('.img-filters');
const filterDefault = document.querySelector('#filter-default');
const filterRandom = document.querySelector('#filter-random');
const filterDiscussed = document.querySelector('#filter-discussed');

let photos = [];
let currentFilter = 'default';

const getRandomPhotos = (data, count = 10) => {
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const getDiscussedPhotos = (data) => {
  return [...data].sort((a, b) => b.comments.length - a.comments.length);
};

const applyFilter = (filterType) => {
  let filteredPhotos = [...photos];

  switch (filterType) {
    case 'random':
      filteredPhotos = getRandomPhotos(photos);
      break;
    case 'discussed':
      filteredPhotos = getDiscussedPhotos(photos);
      break;
    case 'default':
    default:
      filteredPhotos = photos;
  }

  document.querySelectorAll('.img-filters__button').forEach((button) => {
    button.classList.remove('img-filters__button--active');
  });

  document.querySelector(`#filter-${filterType}`).classList.add('img-filters__button--active');

  currentFilter = filterType;

  renderPictures(filteredPhotos);
};

const debouncedApplyFilter = debounce(applyFilter, 500);

const initFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');

  filterDefault.addEventListener('click', () => {
    if (currentFilter !== 'default') {
      debouncedApplyFilter('default');
    }
  });

  filterRandom.addEventListener('click', () => {
    if (currentFilter !== 'random') {
      debouncedApplyFilter('random');
    }
  });

  filterDiscussed.addEventListener('click', () => {
    if (currentFilter !== 'discussed') {
      debouncedApplyFilter('discussed');
    }
  });
};

const loadPhotos = async () => {
  try {
    photos = await loadData();

    initFilters();

    renderPictures(photos);

    initFullscreen(photos);

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

export { photos };
