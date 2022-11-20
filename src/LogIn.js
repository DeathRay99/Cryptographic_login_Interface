import React, { useState, useEffect } from "react";

function LogIn() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [loadData, setLoadData] = useState([]);
  var reGenText="";
  var keyArr = [2, 3, 5, 7, 11];
  var decryptOperation = function (cipher) {
    var temp = parseInt(cipher);
    for (var i = 4; i >= 0; i--) temp = temp / keyArr[i];
    return String.fromCharCode(temp);
  };
  var decrypt = function (matchinTable,cipherText) {
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
        "https://is-project-73d0c-default-rtdb.firebaseio.com/Users.json"
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
    console.log(found);
    if (found) {
        var convertedPass = decrypt(found.Table,found.password);
      if (convertedPass === pass)
        console.log("User successfully logged in", found);
      else console.log("incorrect password");
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
          type="text"
          name="Password"
          id="Password"
          onChange={handlePassChange}
          value={pass}
        />
      </div>
      <button type="submit" className="btn">
        log In
      </button>
    </form>
  );
}
export default LogIn;
