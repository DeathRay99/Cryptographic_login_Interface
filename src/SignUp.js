import React, { useState } from "react";
import "./Common.css";

function SignUp() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  var cipherText = "";
  // var reGenText = "";
  var keyArr = [2, 3, 5, 7, 11];
  var matchinTable = [];
  function encryptOperation(ascii) {
    var temp = ascii;
    for (var i = 0; i < 5; i++) temp = temp * keyArr[i];
    return temp;
  }

  function encrypt(plainText) {
    var newAsciiStr = "";
    for (var i = 0; i < plainText.length; i++) {
      var ascii = plainText.charCodeAt(i);
      var newAsciiInt = encryptOperation(ascii);
      newAsciiStr = newAsciiInt.toString();
      matchinTable.push([newAsciiStr.length, i]);
      cipherText = cipherText + (newAsciiStr + (i + 1).toString());
    }
    return cipherText;
  }
  async function dataSubmitHandler(details) {
    await fetch(
      "https://cryptographic-login-interface-default-rtdb.firebaseio.com/Users.json",
      {
        method: "POST",
        body: JSON.stringify({
          credentials: details,
        }),
      }
    );
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user === "" || pass === "") {
      alert("Field can't be empty");
      return;
    }
    var cipherPass = encrypt(pass);
    var details = {
      UserName: user,
      Password: cipherPass,
      matchinTable: matchinTable,
    };
    dataSubmitHandler(details);
    setUser("");
    setPass("");
    alert("Successfully signed Up!!");
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };
  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="box">
      <div className="name">
        <label htmlFor="Name">UserName</label>
        <input
          type="text"
          name="Name"
          id="Name"
          onChange={handleUserChange}
          value={user}
        />
      </div>
      <div className="password">
        <label htmlFor="Password">Password</label>
        <input
          type="password"
          name="Password"
          id="Password"
          onChange={handlePassChange}
          value={pass}
        />
      </div>
      <div>
        <button type="submit">
          Sign up
          <div class="arrow-wrapper">
            <div class="arrow"></div>
          </div>
        </button>
      </div>
    </form>
  );
}
export default SignUp;
