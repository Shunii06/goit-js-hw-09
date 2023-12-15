import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

document.addEventListener('DOMContentLoaded', () => {
  // Funkcja konwertująca milisekundy na obiekt z dni, godzinami, minutami i sekundami
  function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
  }

  // Funkcja dodająca wiodące zera do liczby (jeśli trzeba)
  function addLeadingZero(value) {
    return value.toString().padStart(2, '0');
  }

  const datetimePicker = flatpickr('#datetime-picker', {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
      const selectedDate = selectedDates[0];

      if (selectedDate < new Date()) {
        alert('Please choose a date in the future');
        document.querySelector('[data-start]').disabled = true;
      } else {
        document.querySelector('[data-start]').disabled = false;
      }
    },
  });

  let intervalId;

  function updateTimer() {
    const currentDate = new Date();
    const targetDate = datetimePicker.selectedDates[0];
    const timeDifference = targetDate - currentDate;

    if (timeDifference <= 0) {
      clearInterval(intervalId);
      alert('Countdown completed!');

      document.querySelector('[data-start]').classList.remove('counting');
      document.querySelector('[data-start]').classList.add('finished');

      return;
    }

    const { days, hours, minutes, seconds } = convertMs(timeDifference);

    document.querySelector('[data-days]').textContent = addLeadingZero(days);
    document.querySelector('[data-hours]').textContent = addLeadingZero(hours);
    document.querySelector('[data-minutes]').textContent =
      addLeadingZero(minutes);
    document.querySelector('[data-seconds]').textContent =
      addLeadingZero(seconds);
  }

  document.querySelector('[data-start]').addEventListener('click', () => {
    intervalId = setInterval(updateTimer, 1000);
    document.querySelector('[data-start]').classList.add('counting');
  });
});
