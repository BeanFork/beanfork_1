function checkPassword() {
  if (document.getElementById("password").value !== "") {
    if (
      document.getElementById("password").value ==
      document.getElementById("confirmpassword").value
    ) {
      document.getElementById("message").innerHTML = " ";
      document.getElementById("submit").disabled = false;
    } else {
      document.getElementById("message").innerHTML =
        "Must match the previous entry";
      document.getElementById("submit").disabled = true;
    }
  }
}

function passwordStrength() {
  var password = document.getElementById("password").value;
  var strongRegex = new RegExp(
    "^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$",
    "g"
  );
  var mediumRegex = new RegExp(
    "^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$",
    "g"
  );
  var enoughRegex = new RegExp("(?=.{6,}).*", "g");
  if (strongRegex.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>STRONG!!!!</p>";
  } else if (mediumRegex.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>Medium!!!</p>";
  } else if (enoughRegex.test(password)) {
    document.getElementById("passwordmessage").innerHTML = "<p>Weak!</p>";
  } else {
    document.getElementById("passwordmessage").innerHTML =
      "<p>Enter valid input</p>";
  }
}

function mailidFormat() {
  var email = document.getElementById("email").value;
  var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (reg.test(email) === false) {
    document.getElementById("idValidation").innerHTML =
      "<p>Enter valid input</p>";
  } else {
    document.getElementById("idValidation").innerHTML = " ";
  }
}

function generateCode() {
  return Math.random()
    .toString(36)
    .slice(-8);
}