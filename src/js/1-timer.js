import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import iconResolve from '../img/bi_x-octagon.png';

let userSelectedDate = null;

const btnStart = document.querySelector('button[data-start]');
const dateTimePicker = document.querySelector('#datetime-picker');
const clockfaceDataDays = document.querySelector('.value[data-days]');
const clockfaceDataHours = document.querySelector('.value[data-hours]');
const clockfaceDataMinutes = document.querySelector('.value[data-minutes]');
const clockfaceDataSeconds = document.querySelector('.value[data-seconds]');

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  locale: {
    firstDayOfWeek: 1,
  },
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0];
    if (userSelectedDate <= Date.now()) {
      iziToast.show({
        theme: 'dark',
        iconUrl: iconResolve,
        backgroundColor: '#EF4040',
        title: 'Error',
        titleSize: '16px',
        titleLineHeight: '150%',
        message: 'Illegal operation',
        messageSize: '16px',
        messageLineHeight: '150%',
        position: 'topRight',
      });
      btnStart.disabled = 'disabled';
    } else {
      iziToast.destroy();
      btnStart.disabled = '';
    }
  },
};

flatpickr(dateTimePicker, options);

class Timer {
  constructor({ onTick, btn, input }) {
    this.onTick = onTick;
    this.btn = btn;
    this.input = input;
    this.init();
  }

  init() {
    this.isActive = false;
    this.intervalId = null;
    const time = this.getTimeComponent(0);
    this.onTick(time);
    this.elementSetDisable(this.btn, true);
    this.elementSetDisable(this.input, false);
  }

  start() {
    if (this.isActive) {
      return;
    }
    this.isActive = true;
    this.elementSetDisable(this.btn, true);
    this.elementSetDisable(this.input, true);

    this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const deltaTime = userSelectedDate - currentTime;
      const time = this.getTimeComponent(deltaTime);
      if (deltaTime < 1000) {
        this.stop();
        this.init();
      }
      this.onTick(time);
    }, 1000);
  }
  stop() {
    clearInterval(this.intervalId);
    const time = this.getTimeComponent(0);
    this.onTick(time);
    this.isActive = false;
    this.elementSetDisable(this.btn, false);
    this.elementSetDisable(this.input, false);
  }

  getTimeComponent(time) {
    const days = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24 * 99)) / (1000 * 60 * 60 * 24))
    );
    const hours = this.pad(
      Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    );
    const mins = this.pad(Math.floor((time % (1000 * 60 * 60)) / (1000 * 60)));
    const secs = this.pad(Math.floor((time % (1000 * 60)) / 1000));

    return { days, hours, mins, secs };
  }

  pad(value) {
    return String(value).padStart(2, '0');
  }
  elementSetDisable(element, bool) {
    element.disabled = bool ? 'disabled' : '';
  }
}

const timer = new Timer({
  onTick: updateClockfase,
  btn: btnStart,
  input: dateTimePicker,
});

btnStart.addEventListener('click', timer.start.bind(timer));

function updateClockfase({ days, hours, mins, secs }) {
  clockfaceDataDays.textContent = `${days}`;
  clockfaceDataHours.textContent = `${hours}`;
  clockfaceDataMinutes.textContent = `${mins}`;
  clockfaceDataSeconds.textContent = `${secs}`;
}
