const modal = document.getElementById('modal');
const modalClose = document.getElementById('modalClose');
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

const COOKIE_FEEDBACK_KEY = 'feedbackSubmitted';
const FORM_KEY = 'feedback_form';
const savedForm = JSON.parse(localStorage.getItem(FORM_KEY));

const form = document.getElementById('feedback');

if (savedForm) {
  for (const key in savedForm) {
    form[key].value = savedForm[key];
  }
}

form.addEventListener('change', () => {
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  localStorage.setItem(FORM_KEY, JSON.stringify(data));
  updateValidatedFields();
});

const submitButton = document.getElementById('submit');
submitButton.addEventListener('click', (event) => {
  event.preventDefault();
  const isValid = form.checkValidity();

  if (!isValid) return updateValidatedFields();
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  document.cookie = `${COOKIE_FEEDBACK_KEY}=${data.firstName} ${data.lastName}`;
  modal.style.display = 'block';
});

const updateValidatedFields = () => {
  for (const element of form.elements) {
    const error = element.nextElementSibling;
    if (element.validity.valid) {
      element.classList.remove('invalid');
      if (error) error.textContent = '';
      continue;
    }
    element.classList.add('invalid');
    error.textContent = getErrorMessage(element);
  }
};

const getErrorMessage = (element) => {
  if (element.validity.valueMissing) return 'This field is required.';

  if (element.validity.typeMismatch)
    return `Please enter a valid ${element.type}.`;

  if (element.validity.patternMismatch)
    return 'Please match the requested format.';

  return 'Invalid input.';
};

const getCookie = (name) => {
  let matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)',
    ),
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
};
