const BASE_URL = 'https://29.javascript.htmlacademy.pro/kekstagram';

const ApiRoute = {
  GET_DATA: '/data',
  POST_DATA: '/',
};

const ApiMethod = {
  GET: 'GET',
  POST: 'POST',
};

const ApiErrorText = {
  GET_DATA: 'Не удалось загрузить фотографии других пользователей. Попробуйте обновить страницу',
  SEND_DATA: 'Ошибка загрузки файла',
};

const loadData = async () => {
  try {
    const response = await fetch(`${BASE_URL}${ApiRoute.GET_DATA}`);

    if (!response.ok) {
      throw new Error(ApiErrorText.GET_DATA);
    }

    return await response.json();
  } catch (error) {
    throw new Error(ApiErrorText.GET_DATA);
  }
};

const sendData = async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}${ApiRoute.POST_DATA}`, {
      method: ApiMethod.POST,
      body: formData,
    });

    if (!response.ok) {
      throw new Error(ApiErrorText.SEND_DATA);
    }

    return await response.json();
  } catch (error) {
    throw new Error(ApiErrorText.SEND_DATA);
  }
};

export { loadData, sendData };
