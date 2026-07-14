const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const form = document.querySelector('#fence-calculator');
const METRES_PER_FOOT = 0.3048;

document.querySelector('#year').textContent = new Date().getFullYear();

navToggle.addEventListener('click', () => {
  const open = body.classList.toggle('nav-open');
  navToggle.setAttribute('aria-expanded', String(open));
});

document.querySelectorAll('.nav-links a').forEach((link) => link.addEventListener('click', () => {
  body.classList.remove('nav-open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

const readMetres = (inputId, unitId) => {
  const value = Number(document.querySelector(inputId).value);
  return document.querySelector(unitId).value === 'feet' ? value * METRES_PER_FOOT : value;
};

function calculateFence() {
  const distanceInput = Number(document.querySelector('#distance').value);
  const distance = readMetres('#distance', '#unit');
  const height = readMetres('#height', '#height-unit');
  const maxSpacing = readMetres('#post-spacing', '#spacing-unit');
  const boardWidth = Number(document.querySelector('#board-width').value) / 1000;
  const gap = Number(document.querySelector('#board-gap').value) / 1000;
  const railsPerBay = Number(document.querySelector('#rails-per-bay').value);
  const error = document.querySelector('#calculator-error');
  const values = [distanceInput, distance, height, maxSpacing, boardWidth, railsPerBay];

  if (values.some((value) => !Number.isFinite(value) || value <= 0) || !Number.isFinite(gap) || gap < 0) {
    error.textContent = 'Enter positive measurements (the board gap may be zero).';
    return;
  }

  error.textContent = '';
  const bays = Math.ceil(distance / maxSpacing);
  const posts = bays + 1;
  const actualBayWidth = distance / bays;
  const boardPitch = boardWidth + gap;
  const verticalBoards = Math.ceil(distance / boardPitch);
  const courses = Math.ceil(height / boardPitch);
  const horizontalBoards = courses * bays;
  const rails = bays * Math.ceil(railsPerBay);
  const selectedUnit = document.querySelector('#unit').value;
  const unitShort = selectedUnit === 'feet' ? 'ft' : 'm';
  const shownRun = Number(distanceInput.toFixed(2));
  const bayDisplay = selectedUnit === 'feet' ? actualBayWidth / METRES_PER_FOOT : actualBayWidth;

  document.querySelector('#posts-result').textContent = posts;
  document.querySelector('#vertical-boards-result').textContent = verticalBoards;
  document.querySelector('#horizontal-boards-result').textContent = horizontalBoards;
  document.querySelector('#rails-result').textContent = rails;
  document.querySelector('#run-summary').textContent = `For a ${shownRun} ${unitShort} fence run`;
  document.querySelector('#bay-summary').textContent = `${bays} ${bays === 1 ? 'bay' : 'bays'} at ≤ ${bayDisplay.toFixed(2)} ${unitShort}`;
  document.querySelector('#formula-summary').textContent = `Posts: ${bays} bays + 1. Portrait: run ÷ ${(boardPitch * 1000).toFixed(0)} mm board pitch. Landscape: ${courses} board courses × ${bays} bays; rails are not required. Vertical rails: ${bays} bays × ${Math.ceil(railsPerBay)}.`;
}

form.addEventListener('input', calculateFence);
form.addEventListener('change', calculateFence);
calculateFence();
