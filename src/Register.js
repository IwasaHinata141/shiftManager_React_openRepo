import React from "react";
import { createUserWithEmailAndPassword,  onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";


const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
    } catch(error) {
      alert("正しく入力してください");
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  return (
    <>
      {user ? (
        <Navigate to={`/`} />
      ) : (
        <>
        <h1>新規登録</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>メールアドレス</label>
            <input
              name="email"
              type="email"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
          </div>
          <div>
            <label>パスワード</label>
            <input
              name="password"
              type="password"
              value={registerPassword}
              onChange={(e)=> setRegisterPassword(e.target.value)}
            />
          </div>
          <button>登録する</button>
          <p>ログインは<Link to={`/login/`}>こちら</Link></p>
        </form>
      </>
      )}
    </>
  );
};

export default Register;