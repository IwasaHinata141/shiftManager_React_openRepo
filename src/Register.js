import React from "react";
import { createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import styles from "./css/Register.module.css"; // CSSモジュールをインポート

const Register = () => {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [user, setUser] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!registerEmail || !registerPassword || !registerName) {
      alert("全ての項目を入力してください");
      return;
    }
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
          <div className={styles.loading}>Loading...</div>
        )}
      </>
      ) : (
        <div className={styles.container}>
          <h1 className={styles.title}>新規登録</h1>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>メールアドレス</label>
              <input
                name="email"
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>パスワード</label>
              <input
                name="password"
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.label}>名前</label>
              <input
                name="name"
                type="text"
                value={registerName}
                onChange={(e) => setRegisterName(e.target.value)}
                className={styles.input}
              />
            </div>
            <button className={styles.button}>登録する</button>
            <p className={styles.link}>ログインは<Link to={`/login/`}>こちら</Link></p>
          </form>
        </div>
      )}
    </>
  );
};

export default Register;