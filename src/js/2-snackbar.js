import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconRejected from '../img/bi_x-octagon.png';
import iconFulfilled from '../img/bi_check2-circle.png';

const form = document.querySelector('.form');

form.addEventListener('submit', createNotification);

const makePromise = ({ value, delay, shouldResolve = true }) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ value, delay });
      } else {
        reject({ value, delay });
      }
    }, delay);
  });
};
function createNotification(evt) {
  evt.preventDefault();
  const params = {
    value: evt.target.elements.state.value,
    delay: evt.target.elements.delay.value,
    shouldResolve:
      evt.target.elements.state.value === 'fulfilled' ? true : false,
  };
  makePromise(params)
    .then(({ value, delay }) => {
      iziToast.show({
        theme: 'dark',
        iconUrl: iconFulfilled,
        backgroundColor: '#59a10d',
        title: 'OK',
        titleSize: '16px',
        titleLineHeight: '150%',
        message: `${value} promise in ${delay}ms`,
        messageSize: '16px',
        messageLineHeight: '150%',
        position: 'topRight',
      });
    })
    .catch(error => {
      iziToast.show({
        theme: 'dark',
        iconUrl: iconRejected,
        backgroundColor: '#EF4040',
        title: 'Error',
        titleSize: '16px',
        titleLineHeight: '150%',
        message: `${error.value} promise in ${error.delay}ms`,
        messageSize: '16px',
        messageLineHeight: '150%',
        position: 'topRight',
      });
    });
}
