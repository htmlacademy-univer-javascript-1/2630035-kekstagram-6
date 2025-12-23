import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;

const bigPictureElement = document.querySelector('.big-picture');
const bigPictureImage = bigPictureElement.querySelector('.big-picture__img img');
const likesCountElement = bigPictureElement.querySelector('.likes-count');
const socialComments = bigPictureElement.querySelector('.social__comments');
const socialCaption = bigPictureElement.querySelector('.social__caption');
const socialCommentCount = bigPictureElement.querySelector('.social__comment-count');
const commentsLoader = bigPictureElement.querySelector('.comments-loader');
const pictureCancelButton = bigPictureElement.querySelector('.big-picture__cancel');
const commentsCountElement = bigPictureElement.querySelector('.comments-count');
const body = document.body;

let currentComments = [];
let commentsShown = 0;
let currentPhotos = [];

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  const avatarImage = document.createElement('img');
  avatarImage.classList.add('social__picture');
  avatarImage.src = comment.avatar;
  avatarImage.alt = comment.name;
  avatarImage.width = 35;
  avatarImage.height = 35;

  const commentText = document.createElement('p');
  commentText.classList.add('social__text');
  commentText.textContent = comment.message;

  commentElement.appendChild(avatarImage);
  commentElement.appendChild(commentText);

  return commentElement;
};

const renderComments = () => {
  const commentsFragment = document.createDocumentFragment();
  const commentsToShow = currentComments.slice(commentsShown, commentsShown + COMMENTS_PER_PORTION);

  commentsToShow.forEach((comment) => {
    const commentElement = createCommentElement(comment);
    commentsFragment.appendChild(commentElement);
  });

  socialComments.appendChild(commentsFragment);
  commentsShown += commentsToShow.length;

  socialCommentCount.innerHTML = `${commentsShown} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (commentsShown >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const openBigPicture = (photoId) => {
  const photo = currentPhotos.find((item) => item.id === photoId);

  if (!photo) {
    return;
  }

  bigPictureImage.src = photo.url;
  bigPictureImage.alt = photo.description;
  likesCountElement.textContent = photo.likes;
  socialCaption.textContent = photo.description;
  commentsCountElement.textContent = photo.comments.length;

  socialComments.innerHTML = '';
  commentsShown = 0;

  currentComments = photo.comments || [];

  renderComments();

  bigPictureElement.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  commentsLoader.addEventListener('click', onCommentsLoaderClick);
  pictureCancelButton.addEventListener('click', closeBigPicture);
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);
  pictureCancelButton.removeEventListener('click', closeBigPicture);

  currentComments = [];
  commentsShown = 0;
};

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
};

const initFullscreen = (photos) => {
  currentPhotos = photos;

  const picturesContainer = document.querySelector('.pictures');

  const onPictureClick = (evt) => {
    const pictureElement = evt.target.closest('.picture');

    if (pictureElement) {
      evt.preventDefault();
      const pictureImage = pictureElement.querySelector('.picture__img');
      const photoId = parseInt(pictureImage.dataset.id, 10);

      if (photoId) {
        openBigPicture(photoId);
      }
    }
  };

  picturesContainer.removeEventListener('click', onPictureClick);
  picturesContainer.addEventListener('click', onPictureClick);
};

export { initFullscreen, closeBigPicture };
