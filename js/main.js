const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const DESCRIPTIONS = [
  'Красивая фотка',
  'Закат на пляже',
  'Шикарный вид',
  'Невероятный пейзаж гор',
  'Рассвет в деревне',
  'Все намана, отдыхаем!'
];

const NAMES = ['Юра', 'Володя', 'Паша', 'Ваня', 'Андрей', 'Маша', 'Таня', 'Лена'];

const DESCRIPTION_COUNT = 25;

const getRandomNumber = (from, to) =>
  Math.floor(Math.random() * (to - from + 1)) + from;

const getUniqueId = () => {
  let lastGeneratedId = 0;
  return () => ++lastGeneratedId;
};

const getPhotoId = getUniqueId();
const getCommentId = getUniqueId();

const getRandomItem = (dataArray) =>
  dataArray[getRandomNumber(0, dataArray.length - 1)];

const createMessage = () => {
  const count = getRandomNumber(1, 2);
  return Array.from({ length: count }, () => getRandomItem(MESSAGES)).join(' ');
};

const createComment = () => ({
  id: getCommentId(),
  avatar: `img/avatar-${getRandomNumber(1, 6)}.svg`,
  message: createMessage(),
  name: getRandomItem(NAMES),
});

const createPhoto = () => {
  const id = getPhotoId();
  return {
    id,
    url: `photos/${id}.jpg`,
    description: getRandomItem(DESCRIPTIONS),
    likes: getRandomNumber(15, 200),
    comments: Array.from({ length: getRandomNumber(0, 30) }, createComment),
  };
};

const photos = Array.from({ length: DESCRIPTION_COUNT }, createPhoto);

console.log(photos);
