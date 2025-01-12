import React from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";



const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        registerEmail,
        registerPassword
      );
      const user = userCredential.user;
      const uid = user.uid;
      console.log(uid);
      const Data = {
        data: {
          userId: uid,
          fullname: registerName,
        }
      };
      const data = JSON.stringify(Data)
      const Url = 'https://make-directory-gpp774oc5q-an.a.run.app';
      const element = {
        headers: {
          "Content-Type": "application/json;"
        },
        body: data,
        method: "POST",
        mode: 'cors'
      }
      await fetch(Url, element).catch(error => console.log(error));

      setTimeout(() => {
        console.log('5秒経過しました');
        setLoading(true);
      }, 5000);

      
    } catch (error) {
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
      {user ? (<>
        {loading ? (
          <Navigate to={`/`} />
        ) : (
          <>
            <div>Loding...</div>
          </>
        )}
      </>
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
                onChange={(e) => setRegisterPassword(e.target.value)}
              />
            </div>
            <div>
              <label>名前</label>
              <input
                name="name"
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
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