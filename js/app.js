// Register elements
const registerBtn = document.getElementById('register-btn');
const usernameReg = document.getElementById('username-value-reg');
const passwordReg = document.getElementById('password-value-reg');
const confirmPasswordReg = document.getElementById('confirm-password');
const usernameRegLabel = document.getElementById('username-reg-lable');
const passwordRegLabel = document.getElementById('password-reg-lable');
const confirmPasswordLabel = document.getElementById('confirm-password-lable');

// Login elements
const loginBtn = document.getElementById('login-btn');
const usernameLog = document.getElementById('username-value-log');
const passwordLog = document.getElementById('password-value-log');
const usernameLogLabel = document.getElementById('username-log-label');
const passwordLogLabel = document.getElementById('password-log-lable');

// Set label text content
usernameLogLabel.textContent = 'Username:';
passwordLogLabel.textContent = 'Password:';

usernameRegLabel.textContent = 'Username:';
passwordRegLabel.textContent = 'Password:';
confirmPasswordLabel.textContent = 'Confirm Password:';

// Event listener for registration form
registerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  
  let valid = true;

  if (usernameReg.value.length < 3) {
    usernameRegLabel.textContent = 'Username: (min 3 characters)';
    usernameRegLabel.style.color = 'red';
    valid = false;
  } else {
    usernameRegLabel.textContent = 'Username:';
    usernameRegLabel.style.color = 'black';
  }

  if (passwordReg.value.length < 8) {
    passwordRegLabel.textContent = 'Password: (min 8 characters)';
    passwordRegLabel.style.color = 'red';
    valid = false;
  } else {
    passwordRegLabel.textContent = 'Password:';
    passwordRegLabel.style.color = 'black';
  }

  if (confirmPasswordReg.value !== passwordReg.value) {
    confirmPasswordLabel.textContent = 'Confirm Password: (does not match)';
    confirmPasswordLabel.style.color = 'red';
    valid = false;
  } else {
    confirmPasswordLabel.textContent = 'Confirm Password:';
    confirmPasswordLabel.style.color = 'black';
  }

  if (valid) {
    // Store username and password in localStorage
    localStorage.setItem('username', usernameReg.value);
    localStorage.setItem('password', passwordReg.value);
    alert('Registration successful');
  }
});

// Event listener for login form
loginBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const storedUsername = localStorage.getItem('username');
  const storedPassword = localStorage.getItem('password');

  if (usernameLog.value === storedUsername && passwordLog.value === storedPassword) {
    alert('Login successful');
    // Redirect to another page
    window.location.href = 'https://monkfish-app-zkoqu.ondigitalocean.app/'; // Replace with your desired URL
  } else {
    alert('Invalid login credentials');
  }
});
