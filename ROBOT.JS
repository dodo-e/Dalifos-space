function checkPassword() {
  const correctPassword = "59CTR"; 

  const enteredPassword = document.getElementById("password-input").value;
  const errorMessage = document.getElementById("error-message");

  if (enteredPassword === correctPassword) {
    window.location.href = "start 4.html";
  } else {
    alert("you didn't solve it. Please try again.");
  }
}