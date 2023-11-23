const start = document.getElementById('start');

const startGame = () => {
  const number = Math.floor(Math.random() * 1000) + 1;
  let attempts = 0;

  const guess = () => {
    const input = prompt('Input number:');
    if (input === null || input === '') return;

    const parsed = +input;
    if (isNaN(parsed)) {
      alert('This is not a number.');
      return guess();
    }

    attempts++;

    if (parsed < number) {
      alert('The desired number is greater');
      guess();
    } else if (parsed > number) {
      alert('The desired number is less');
      guess();
    } else {
      const willPlayAgain = confirm(
        `You have won. Attempts: ${attempts}. Wanna play again?`,
      );
      if (willPlayAgain) {
        startGame();
      }
    }
  };

  guess();
};
start.addEventListener('click', startGame);
