import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const nav = useNavigate();

  function setCookie(cname, cvalue, exphours) {
    const d = new Date();
    d.setTime(d.getTime() + exphours * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }

  const submitHandler = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const result = await axios.post(
      "https://api-oos.jojonomic.com/26036/login",
      {
        username,
        password,
      }
    );

    if (result.data.error) {
      alert("username/password salah!");
      setIsLoading(false);
      return;
    }

    setCookie("auth", JSON.stringify(result.data), 1);
    setIsLoading(false);
    nav("/");
  };

  const Loading = () => {
    if (isLoading) return <p>Loading...</p>;
  };
  return (
    <>
      <h1>Login</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label>Username</label>
          <input type="text" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Submit </button>
        <Loading />
      </form>
    </>
  );
}

export default LoginPage;
