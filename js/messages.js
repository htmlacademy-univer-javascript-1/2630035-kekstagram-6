const ALERT_SHOW_TIME = 5000;

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'fixed';
  alertContainer.style.left = '0';
  alertContainer.style.top = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '20px 10px';
  alertContainer.style.fontSize = '16px';
  alertContainer.style.fontFamily = 'Arial, sans-serif';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = '#ff4e4e';
  alertContainer.style.color = '#ffffff';
  alertContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

const showSuccessMessage = () => {
  const successTemplate = document.querySelector('#success');
  if (!successTemplate) {
    return;
  }

  const successElement = successTemplate.content.cloneNode(true);
  const successSection = successElement.querySelector('.success');

  document.body.appendChild(successElement);
  const successButton = document.querySelector('.success__button');

  const onSuccessClick = (evt) => {
    if (evt.target === successSection || evt.target === successButton) {
      closeSuccessMessage();
    }
  };

  const onSuccessKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeSuccessMessage();
    }
  };

  const closeSuccessMessage = () => {
    successSection.remove();
    document.removeEventListener('keydown', onSuccessKeydown);
    successSection.removeEventListener('click', onSuccessClick);
  };

  document.addEventListener('keydown', onSuccessKeydown);
  successSection.addEventListener('click', onSuccessClick);
};

const showErrorMessage = (onRetry) => {
  const errorTemplate = document.querySelector('#error');
  if (!errorTemplate) {
    return;
  }

  const errorElement = errorTemplate.content.cloneNode(true);
  const errorSection = errorElement.querySelector('.error');

  document.body.appendChild(errorElement);
  const errorButton = document.querySelector('.error__button');

  const onErrorClick = (evt) => {
    if (evt.target === errorSection || evt.target === errorButton) {
      closeErrorMessage();
    }
  };

  const onErrorKeydown = (evt) => {
    if (evt.key === 'Escape') {
      closeErrorMessage();
    }
  };

  const closeErrorMessage = () => {
    errorSection.remove();
    document.removeEventListener('keydown', onErrorKeydown);
    errorSection.removeEventListener('click', onErrorClick);

    if (onRetry && typeof onRetry === 'function') {
      onRetry();
    }
  };

  document.addEventListener('keydown', onErrorKeydown);
  errorSection.addEventListener('click', onErrorClick);
};

export { showAlert, showSuccessMessage, showErrorMessage };
