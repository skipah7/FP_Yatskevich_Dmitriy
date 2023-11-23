const output = document.getElementById('output');
const form = document.getElementById('calculator');
const operands = document.querySelectorAll('button[data-type=operand]');
const operators = document.querySelectorAll('button[data-type=operator]');

form.addEventListener('submit', (event) => event.preventDefault());

let isOperator = false;
let equation = [];

const removeActive = () => {
  for (const button of operators) {
    button.classList.remove('active');
  }
};

for (const button of operands) {
  button.addEventListener('click', (event) => {
    removeActive();
    if (output.value == '0') {
      output.value = event.target.value;
    } else if (isOperator) {
      isOperator = false;
      output.value = event.target.value;
    } else if (output.value.includes('.')) {
      output.value = output.value + '' + event.target.value.replace('.', '');
    } else {
      output.value = output.value + '' + event.target.value;
    }
  });
}

for (const button of operators) {
  button.addEventListener('click', (event) => {
    removeActive();
    event.currentTarget.classList.add('active');

    const value = event.target.value;
    if (value === '%') {
      output.value = parseFloat(output.value) / 100;
    } else if (value === 'invert') {
      output.value = parseFloat(output.value) * -1;
    } else if (value === '=') {
      equation.push(output.value);
      // huge security risk, but its fine for calculator app
      output.value = eval(equation.join(''));
      equation = [];
    } else {
      let last_item = equation[equation.length - 1];
      if (['/', '*', '+', '-'].includes(last_item) && isOperator) {
        equation.pop();
        equation.push(event.target.value);
      } else {
        equation.push(output.value);
        equation.push(event.target.value);
      }
      isOperator = true;
    }
  });
}
