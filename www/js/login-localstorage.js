// Select the forms
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Set the API endpoint URL
const apiEndpoint = 'https://your-server.com/api';

// Add event listeners to the forms
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;

  // Send a request to the API to verify the credentials
  fetch(`${apiEndpoint}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Login successful!');
      // Redirect to the new page
      window.location.href = 'https://monkfish-app-zkoqu.ondigitalocean.app/';
    } else {
      console.log('Invalid username or password');
    }
  })
  .catch(error => console.error('Error:', error));
});

registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = registerForm.username.value;
  const password = registerForm.password.value;

  // Send a request to the API to register the user
  fetch(`${apiEndpoint}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Register form submitted!');
    console.log('Username and password stored:', data);
  })
  .catch(error => console.error('Error:', error));
});