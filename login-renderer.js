let aUsername;
let aPassword;

document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const rememberMe = document.getElementById("rememberMe");

  if (username == aUsername && password == aPassword) {
    if (rememberMe.checked == true) {
      window.localStorage.setItem("username", username);
      window.localStorage.setItem("password", password);
    } else {
      window.localStorage.setItem("username", "");
      window.localStorage.setItem("password", "");
    }

    // Send login request to the server with a chuckle
    window.electronAPI.setLoginCredentials("success");
  } else {
    window.electronAPI.setLoginCredentials("failed");
  }
});

function populateRememberMe() {
  let cuser = window.localStorage.getItem("username");
  let cpass = window.localStorage.getItem("password");
  const rememberMe = document.getElementById("rememberMe");

  document.getElementById("username").value = cuser;
  document.getElementById("password").value = cpass;

  if ((cuser != "") & (cpass != "")) {
    rememberMe.checked = true;
  }
}

function prepareInt(d) {
  G_dbName = d.database.dbName;
  G_version = d.database.version;
  aUsername = d.credential.user;
  aPassword = d.credential.password;

  populateRememberMe();
}

(function () {
  // Call the exposed function from the preload script.
  window.electronAPI
    .readFile()
    // Attach a `.then` event since we made it a promise that returns data.
    .then(({ event, data }) => {
      prepareInt(data);
    });
})();
