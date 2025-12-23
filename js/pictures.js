const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

const createPictureElement = (photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = photo.url;
  pictureImage.alt = photo.description;
  pictureImage.dataset.id = photo.id;

  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;

  return pictureElement;
};

const renderPictures = (photos) => {
  const picturesContainer = document.querySelector('.pictures');
  const pictureListFragment = document.createDocumentFragment();

  photos.forEach((photo) => {
    const pictureElement = createPictureElement(photo);
    pictureListFragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(pictureListFragment);
};

const clearPictures = () => {
  const picturesContainer = document.querySelector('.pictures');
  const existingPictures = picturesContainer.querySelectorAll('.picture');

  existingPictures.forEach((picture) => picture.remove());
};

export { renderPictures, clearPictures };
