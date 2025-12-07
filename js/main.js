import {MESSAGES, DESCRIPTIONS, NAMES, DESCRIPTION_COUNT} from './data.js';
import {getRandomNumber, getPhotoId, getUrl, getCommentId, getRandomItem} from './util.js';
import { renderPictures } from './pictures.js';
import { initFullscreen } from './fullscreen.js';

const createComments = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
  message: getRandomItem(MESSAGES),
  name: getRandomItem(NAMES)
});


const createDescriptionPhoto = () => ({
  id: getPhotoId(),
  url: `photos/${getUrl()}.jpg`,
  description: getRandomItem(DESCRIPTIONS),
  likes: getRandomNumber(15, 200),
  comments: Array.from({length: getRandomNumber(0, 30)}, createComments)
});

const descriptionsPhoto = Array.from({length: DESCRIPTION_COUNT}, createDescriptionPhoto);
renderPictures(descriptionsPhoto);
initFullscreen(descriptionsPhoto);
console.log(descriptionsPhoto);
