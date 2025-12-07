// pictures.js

const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

// Функция создания DOM-элемента для фотографии
const createPictureElement = ({ url, description, likes, comments }) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  const pictureImage = pictureElement.querySelector('.picture__img');
  pictureImage.src = url;
  pictureImage.alt = description;

  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  return pictureElement;
};

// Функция отрисовки фотографий в блок .pictures
const renderPictures = (pictures) => {
  const picturesContainer = document.querySelector('.pictures');
  const fragment = document.createDocumentFragment();

  // Очищаем контейнер перед отрисовкой (если нужно)
  const existingPictures = picturesContainer.querySelectorAll('.picture');
  existingPictures.forEach(picture => picture.remove());

  pictures.forEach(picture => {
    const pictureElement = createPictureElement(picture);
    fragment.appendChild(pictureElement);
  });

  picturesContainer.appendChild(fragment);
};

export { renderPictures };
