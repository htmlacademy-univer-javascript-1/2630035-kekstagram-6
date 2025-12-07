
const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentsCount = bigPicture.querySelector('.comments-count');
const socialComments = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const pictureCancel = bigPicture.querySelector('#picture-cancel');
const body = document.body;

const COMMENTS_PER_PORTION = 5;

let currentComments = [];
let shownCommentsCount = 0;

const createCommentElement = (comment) => {
  const commentElement = document.createElement('li');
  commentElement.classList.add('social__comment');

  commentElement.innerHTML = `
    <img
      class="social__picture"
      src="${comment.avatar}"
      alt="${comment.name}"
      width="35" height="35">
    <p class="social__text">${comment.message}</p>
  `;

  return commentElement;
};

const renderCommentsPortion = () => {
  const commentsToShow = currentComments.slice(shownCommentsCount, shownCommentsCount + COMMENTS_PER_PORTION);

  const fragment = document.createDocumentFragment();
  commentsToShow.forEach(comment => {
    fragment.appendChild(createCommentElement(comment));
  });

  socialComments.appendChild(fragment);
  shownCommentsCount += commentsToShow.length;

  commentCountElement.innerHTML = `${shownCommentsCount} из <span class="comments-count">${currentComments.length}</span> комментариев`;

  if (shownCommentsCount >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  }
};

const onCommentsLoaderClick = () => {
  renderCommentsPortion();
};

const openFullscreen = (pictureData) => {
  bigPictureImg.src = pictureData.url;
  bigPictureImg.alt = pictureData.description;
  likesCount.textContent = pictureData.likes;
  commentsCount.textContent = pictureData.comments.length;
  socialCaption.textContent = pictureData.description;

  currentComments = pictureData.comments;
  shownCommentsCount = 0;

  socialComments.innerHTML = '';

  commentCountElement.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  renderCommentsPortion();

  commentsLoader.addEventListener('click', onCommentsLoaderClick);

  bigPicture.classList.remove('hidden');
  body.classList.add('modal-open');

  document.addEventListener('keydown', onDocumentKeydown);
  pictureCancel.addEventListener('click', closeFullscreen);
};

const closeFullscreen = () => {
  bigPicture.classList.add('hidden');
  body.classList.remove('modal-open');

  document.removeEventListener('keydown', onDocumentKeydown);
  pictureCancel.removeEventListener('click', closeFullscreen);
  commentsLoader.removeEventListener('click', onCommentsLoaderClick);

  currentComments = [];
  shownCommentsCount = 0;
};

const onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    evt.preventDefault();
    closeFullscreen();
  }
};

const initFullscreen = (pictures) => {
  const pictureElements = document.querySelectorAll('.picture');

  pictureElements.forEach((pictureElement, index) => {
    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openFullscreen(pictures[index]);
    });
  });
};

export { initFullscreen };
