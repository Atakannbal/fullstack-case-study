//if another event occurs before setTimeout has expired
//we will clear the setTimeout and reset it
//only when the delay time is fully expired will the function be triggered

export function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
}
