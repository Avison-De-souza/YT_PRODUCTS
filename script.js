// document.getElementById("loginForm").addEventListener("submit", function(e) {
//   e.preventDefault();

//   const username = document.getElementById("username").value;
//   const password = document.getElementById("password").value;

//   const xhr = new XMLHttpRequest();
//   xhr.open("POST", "login.php", true);
//   xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

//   xhr.onload = function() {
//     if (this.status === 200) {
//       const response = JSON.parse(this.responseText);
//       const msg = document.getElementById("message");

//       if (response.success) {
//         msg.style.color = "green";
//         msg.textContent = "Login successful! Redirecting...";
//         setTimeout(() => {
//           window.location.href = "home.html";
//         }, 1500);
//       } else {
//         msg.style.color = "red";
//         msg.textContent = response.message;
//       }
//     }
//   };

//   const data = JSON.stringify({ username, password });
//   xhr.send(data);
// });

// // Redirect to home page when clicking sign up
// document.getElementById("signupBtn").addEventListener("click", function(e) {
//   e.preventDefault();
//   window.location.href = "home.html";
// });

document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const nameError = document.getElementById("nameError");
  const passError = document.getElementById("passError");
  const msg = document.getElementById("message");

  // Reset previous error messages
  nameError.textContent = "";
  passError.textContent = "";
  msg.textContent = "";

  // Frontend validation before sending AJAX
  if (username === "") {
    nameError.textContent = "Enter the name";
    return;
  }

  if (password === "") {
    passError.textContent = "Enter the password";
    return;
  }

  // Send data to PHP via AJAX
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "login.php", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

  xhr.onload = function() {
    if (this.status === 200) {
      const response = JSON.parse(this.responseText);

      if (response.success) {
        msg.style.color = "green";
        msg.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
          window.location.href = "home.html";
        }, 1500);
      } else {
        msg.style.color = "red";
        msg.textContent = response.message;
      }
    }
  };

  const data = JSON.stringify({ username, password });
  xhr.send(data);
});

// Redirect to home page when clicking sign up
document.getElementById("signupBtn").addEventListener("click", function(e) {
  e.preventDefault();
  window.location.href = "home.html";
});