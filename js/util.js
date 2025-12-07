

const getRandomNumber = (from, to) => {
  const randomNumber = Math.random() * (to - from + 1);
  return Math.floor(randomNumber);
};

const getUniqeId = () => {
  let lastGeneratedId = 0;

  return function () {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const getPhotoId = getUniqeId();
const getUrl = getUniqeId();
const getCommentId = getUniqeId();


const getRandomItem = (dataArray) => dataArray[getRandomNumber(0, dataArray.length - 1)];

export {getRandomNumber, getUniqeId, getPhotoId, getUrl, getCommentId, getRandomItem};
