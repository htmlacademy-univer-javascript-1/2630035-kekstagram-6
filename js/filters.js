import { debounce } from './util.js';

const RANDOM_PHOTOS_COUNT = 10;
const FILTER_DEBOUNCE_DELAY = 500;

const filterFunctions = {
  default: (photos) => [...photos],

  random: (photos) => {
    const shuffled = [...photos].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, RANDOM_PHOTOS_COUNT);
  },

  discussed: (photos) => {
    return [...photos].sort((a, b) => b.comments.length - a.comments.length);
  }
};

class Filters {
  constructor() {
    this.currentFilter = 'default';
    this.photos = [];
    this.onFilterChange = null;

    this.imgFiltersContainer = document.querySelector('.img-filters');
    this.filterButtons = document.querySelectorAll('.img-filters__button');

    this.debouncedApplyFilter = debounce(this.applyFilter.bind(this), FILTER_DEBOUNCE_DELAY);
  }

  init(photos, onFilterChangeCallback) {
    this.photos = photos;
    this.onFilterChange = onFilterChangeCallback;

    this.imgFiltersContainer.classList.remove('img-filters--inactive');

    this.updateActiveFilterButton('filter-default');

    this.filterButtons.forEach((button) => {
      button.addEventListener('click', this.onFilterButtonClick.bind(this));
    });
  }

  onFilterButtonClick(evt) {
    const clickedButton = evt.target;
    const filterType = clickedButton.id.replace('filter-', '');

    if (this.currentFilter === filterType) {
      return;
    }

    this.updateActiveFilterButton(clickedButton.id);

    this.currentFilter = filterType;

    this.debouncedApplyFilter();
  }

  updateActiveFilterButton(activeButtonId) {
    this.filterButtons.forEach((button) => {
      button.classList.remove('img-filters__button--active');
      if (button.id === activeButtonId) {
        button.classList.add('img-filters__button--active');
      }
    });
  }

  applyFilter() {
    const filteredPhotos = filterFunctions[this.currentFilter](this.photos);

    if (this.onFilterChange && typeof this.onFilterChange === 'function') {
      this.onFilterChange(filteredPhotos);
    }
  }

  destroy() {
    this.filterButtons.forEach((button) => {
      button.removeEventListener('click', this.onFilterButtonClick.bind(this));
    });
  }
}

export { Filters };
