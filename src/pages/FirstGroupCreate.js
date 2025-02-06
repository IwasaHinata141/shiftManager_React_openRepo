import React from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase.js";
import { Navigate } from "react-router-dom";
import { useGroup } from "../fetch/CurrentGroupFetch.js"
import { signOut } from "firebase/auth"
import { useNavigate } from "react-router-dom";
import styles from "../css/FirstGroupCreate.module.css"; // CSSモジュールをインポート

const FirstGroupCreate = () => {
  const [user, setUser] = useState([]);
  const { currentGroup, isCurrentGroupLoading } = useGroup(user);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        console.log("no user");
        navigate('/login');
      }
    });
  });

  const groupName_reference = useRef();
  const groupPass_reference = useRef();

  async function createGroup(uid) {
    console.log("ただいま送信中");
    console.log(uid);
    const groupName = groupName_reference.current.value;
    const groupPass = groupPass_reference.current.value;

    const Data = {
      data: {
        userId: uid,
        groupName: groupName,
        pass: groupPass,
      }
    };
    const data = JSON.stringify(Data)
    console.log(data);
    const Url = 'https://create-group-gpp774oc5q-an.a.run.app';
    const element = {
      headers: {
        "Content-Type": "application/json;"
      },
      body: data,
      method: "POST",
      mode: 'cors'
    }
    await fetch(Url, element).catch(error => console.log(error))
    window.location.reload();
  }

  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }


  return (
    <div className={styles.container}>
      <div>
        {!isCurrentGroupLoading ? (
          <div className={styles.firstGroupCreateApp}>
            <div className={styles.firstGroupCreateContentBox}>
              {currentGroup.groups["1"].groupName !== "no data" ? (
                <Navigate to={'/'} />
              ) : (
                <div>
                  <div>
                    <h1 className={styles.title}>新規グループの作成</h1>
                    <ul className={styles.inputItemBox}>
                      <li className={styles.inputItem}>
                        <div className={styles.item}>グループ名</div>
                        <input type='text' ref={groupName_reference} className={styles.input}></input>
                      </li>
                      <li className={styles.inputItem}>
                        <div className={styles.item}>グループパスワード</div>
                        <input type='text' ref={groupPass_reference} className={styles.input}></input>
                      </li>
                    </ul>
                    <div className={styles.submitArea}>
                      <button className={styles.submit} onClick={() => createGroup(user)}>作成</button>
                    </div>
                    <div className={styles.spacer}></div>
                  </div>
                  <ul className={styles.groupList}>
                    <li>ユーザーを管理するグループが必要です</li>
                  </ul>
                  <button className={styles.logout} onClick={() => logout()}>ログアウト</button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.loading}>Loading...</div>
        )}
      </div>
    </div>
  )
}

export default FirstGroupCreate