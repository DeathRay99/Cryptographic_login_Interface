import React, { useState, useEffect } from "react";
import "./Common.css";
import { Link } from "react-router-dom";

function LogIn() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loadData, setLoadData] = useState([]);
  var reGenText = "";
  var keyArr = [2, 3, 5, 7, 11];

  var decryptOperation = function (cipher) {
    var temp = parseInt(cipher);
    for (var i = 4; i >= 0; i--) temp = temp / keyArr[i];
    return String.fromCharCode(temp);
  };
  var decrypt = function (matchinTable, cipherText) {
    var y = 0;
    var w = 0;
    var k = 0;
    for (var it = 0; it < matchinTable.length; it++) {
      k++;
      var codeLength = matchinTable[it][0];
      var temp = "";
      for (var i = y; i < y + codeLength; i++) {
        temp = temp + cipherText[i];
        w++;
      }
      console.log("Temp : " + temp);
      var de = decryptOperation(temp);
      reGenText = reGenText + de;
      y = w + k;
    }
    return reGenText;
  };

  useEffect(() => {
    info();
  }, []);

  async function info() {
    try {
      const response = await fetch(
        "https://cryptographic-login-interface-default-rtdb.firebaseio.com/Users.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const data = await response.json();
      let incomingData = [];
      for (const key in data) {
        incomingData.push({
          id: key,
          user: data[key].credentials.UserName,
          password: data[key].credentials.Password,
          Table: data[key].credentials.matchinTable,
        });
      }
      console.log(incomingData);
      setLoadData(incomingData);
    } catch (error) {
      console.log(error.message);
    }
  }

  const handleVerify = (event) => {
    event.preventDefault();
    if (user === "" || pass === "") {
      alert("Field can't be empty");
      return;
    }
    const found = loadData.find((userInfo) => {
      return userInfo.user === user;
    });
    // console.log(found);
    if (found) {
      var convertedPass = decrypt(found.Table, found.password);
      if (convertedPass === pass) {
        alert("User successfully logged in");
        console.log("User successfully logged in", found);
      } else {
        alert("incorrect password");
        console.log("incorrect password");
      }
    } else {
      console.log("user not found");
    }
    setUser("");
    setPass("");
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };
  const handlePassChange = (event) => {
    setPass(event.target.value);
  };

  return (
    <div className="mainbox">
      <form onSubmit={handleVerify} className="box">
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
            log In
            <div class="arrow-wrapper">
              <div class="arrow"></div>
            </div>
          </button>
        </div>
      </form>

      <div className="lastclass">
        <div className="last1">New User , SignIn?</div>
        <div className="last2">
          <Link to="/signup">
            <button>
              Sign up
              <div class="arrow-wrapper">
                <div class="arrow"></div>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
export default LogIn;
