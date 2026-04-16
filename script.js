const display = document.getElementById("display");
const displayLabel = document.getElementById("displayLabel");
const keys = document.querySelector(".keypad");
let audioContext;

const state = {
  displayValue: "0",
  firstValue: null,
  operator: null,
  waitingForSecondValue: false,
  showingResult: false,
  lastExpression: "",
};

function render() {
  if (state.showingResult) {
    displayLabel.textContent = state.lastExpression
      ? `${state.lastExpression} =`
      : "Result";
    display.textContent = state.displayValue;
    return;
  }

  displayLabel.textContent = "Expression";
  display.textContent = getExpressionText();
}

function getOperatorSymbol(operator) {
  const symbols = {
    "+": "+",
    "-": "-",
    "*": "\u00D7",
    "/": "\u00F7",
  };

  return symbols[operator] || operator;
}

function getExpressionText() {
  if (state.firstValue === null || !state.operator) {
    return state.displayValue;
  }

  const firstPart = formatResult(state.firstValue);
  const operatorPart = getOperatorSymbol(state.operator);

  if (state.waitingForSecondValue) {
    return `${firstPart} ${operatorPart}`;
  }

  return `${firstPart} ${operatorPart} ${state.displayValue}`;
}

function resetAfterResultIfNeeded() {
  if (!state.showingResult) {
    return;
  }

  state.displayValue = "0";
  state.firstValue = null;
  state.operator = null;
  state.waitingForSecondValue = false;
  state.showingResult = false;
  state.lastExpression = "";
}

function playClickSound(action) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return;
  }

  if (!audioContext) {
    audioContext = new AudioContextClass();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const overtone = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const overtoneGain = audioContext.createGain();
  const lowpass = audioContext.createBiquadFilter();
  const now = audioContext.currentTime;

  const tones = {
    digit: 760,
    decimal: 720,
    operator: 680,
    equals: 620,
    clear: 540,
    "toggle-sign": 600,
    percent: 640,
  };

  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(1800, now);
  lowpass.Q.setValueAtTime(0.7, now);

  oscillator.type = "sine";
  overtone.type = "triangle";
  oscillator.frequency.setValueAtTime(tones[action] || 500, now);
  overtone.frequency.setValueAtTime((tones[action] || 500) * 1.5, now);

  gainNode.gain.setValueAtTime(0.0001, now);
  gainNode.gain.exponentialRampToValueAtTime(0.028, now + 0.004);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

  overtoneGain.gain.setValueAtTime(0.0001, now);
  overtoneGain.gain.exponentialRampToValueAtTime(0.009, now + 0.003);
  overtoneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

  oscillator.connect(gainNode);
  overtone.connect(overtoneGain);
  gainNode.connect(lowpass);
  overtoneGain.connect(lowpass);
  lowpass.connect(audioContext.destination);

  oscillator.start(now);
  overtone.start(now);
  oscillator.stop(now + 0.05);
  overtone.stop(now + 0.035);
}

function inputDigit(digit) {
  resetAfterResultIfNeeded();

  if (state.waitingForSecondValue) {
    state.displayValue = digit;
    state.waitingForSecondValue = false;
    return;
  }

  state.displayValue =
    state.displayValue === "0" ? digit : state.displayValue + digit;
}

function inputDecimal() {
  resetAfterResultIfNeeded();

  if (state.waitingForSecondValue) {
    state.displayValue = "0.";
    state.waitingForSecondValue = false;
    return;
  }

  if (!state.displayValue.includes(".")) {
    state.displayValue += ".";
  }
}

function clearAll() {
  state.displayValue = "0";
  state.firstValue = null;
  state.operator = null;
  state.waitingForSecondValue = false;
  state.showingResult = false;
  state.lastExpression = "";
}

function toggleSign() {
  if (state.displayValue === "0") {
    return;
  }

  state.showingResult = false;
  state.displayValue = String(Number(state.displayValue) * -1);
}

function percent() {
  state.showingResult = false;
  state.displayValue = String(Number(state.displayValue) / 100);
}

function calculate(first, second, operator) {
  switch (operator) {
    case "+":
      return first + second;
    case "-":
      return first - second;
    case "*":
      return first * second;
    case "/":
      return second === 0 ? "Error" : first / second;
    default:
      return second;
  }
}

function formatResult(value) {
  if (value === "Error") {
    return value;
  }

  const rounded = Number.parseFloat(value.toFixed(10));
  return String(rounded);
}

function handleOperator(nextOperator) {
  if (state.showingResult) {
    state.showingResult = false;
    state.lastExpression = "";
  }

  const inputValue = Number(state.displayValue);

  if (state.operator && state.waitingForSecondValue) {
    state.operator = nextOperator;
    return;
  }

  if (state.firstValue === null) {
    state.firstValue = inputValue;
  } else if (state.operator) {
    const result = calculate(state.firstValue, inputValue, state.operator);
    state.displayValue = formatResult(result);
    state.firstValue = result === "Error" ? null : Number(state.displayValue);
  }

  state.waitingForSecondValue = true;
  state.operator = nextOperator;
}

function handleEquals() {
  if (!state.operator || state.waitingForSecondValue) {
    return;
  }

  const secondValue = Number(state.displayValue);
  state.lastExpression = `${formatResult(state.firstValue)} ${getOperatorSymbol(
    state.operator
  )} ${state.displayValue}`;
  const result = calculate(state.firstValue, secondValue, state.operator);

  state.displayValue = formatResult(result);
  state.firstValue = result === "Error" ? null : Number(state.displayValue);
  state.operator = null;
  state.waitingForSecondValue = false;
  state.showingResult = true;
}

keys.addEventListener("click", (event) => {
  const button = event.target.closest("button");

  if (!button) {
    return;
  }

  const { action, value } = button.dataset;

  playClickSound(action);

  if (action === "digit") inputDigit(value);
  if (action === "decimal") inputDecimal();
  if (action === "clear") clearAll();
  if (action === "toggle-sign") toggleSign();
  if (action === "percent") percent();
  if (action === "operator") handleOperator(value);
  if (action === "equals") handleEquals();

  render();
});

document.addEventListener("keydown", (event) => {
  const { key } = event;
  let actionToSound = null;

  if (/^\d$/.test(key)) {
    inputDigit(key);
    actionToSound = "digit";
  }
  if (key === ".") {
    inputDecimal();
    actionToSound = "decimal";
  }
  if (key === "Escape") {
    clearAll();
    actionToSound = "clear";
  }
  if (key === "%") {
    percent();
    actionToSound = "percent";
  }
  if (["+", "-", "*", "/"].includes(key)) {
    handleOperator(key);
    actionToSound = "operator";
  }
  if (key === "Enter" || key === "=") {
    handleEquals();
    actionToSound = "equals";
  }
  if (key === "Backspace") {
    if (!state.showingResult && !state.waitingForSecondValue) {
      state.displayValue =
        state.displayValue.length > 1
          ? state.displayValue.slice(0, -1)
          : "0";
      actionToSound = "clear";
    }
  }

  if (actionToSound) {
    playClickSound(actionToSound);
  }

  render();
});

render();
