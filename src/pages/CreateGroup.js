import React from 'react'
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase.js";
import Header from '../components/Header.js';
import { Navigate } from "react-router-dom";
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import styles from '../css/CreateGroup.module.css';
import { useNavigate } from "react-router-dom";


const CreateGroup = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();
  const { currentGroup, isCurrentGroupLoading } = useGroup(user);
  console.log(isCurrentGroupLoading);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
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
  }

  async function deleteGroup(groupId, uid, num) {
    console.log("ただいま送信中");
    const nextNum = num + 1;
    const Data = {
      data: {
        userId: uid,
        groupId: groupId,
        num: nextNum,
      }
    };
    const data = JSON.stringify(Data)
    console.log(data);
    const Url = 'https://delete-group-gpp774oc5q-an.a.run.app';
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

  return (
    <div>
      <div className="headerApp">
        <Header uid={user} />
      </div>
      <div className="SidebarApp">
        <Sidebar />
      </div>
      {!isCurrentGroupLoading ? (
        <div className="mainApp">
          <div className='manageGroup'>
            {currentGroup.groupId !== "no data" ? (
              ///グループがある場合
              <div className={styles.createGroupPage}>
                <div className={styles.createGroupBox}>
                  <h4 className={styles.title}>新規グループの作成</h4>
                  <ul className={styles.inputItemBox}>
                    <li className={styles.inputItem}>
                      <div id={styles.item} >グループ名：</div>
                      <div id={styles.value}>
                        <input type='text' ref={groupName_reference}></input>
                      </div>
                    </li>
                    <li className={styles.inputItem}>
                      <div id={styles.item}>グループパスワード：</div>
                      <div id={styles.value}>
                        <input type='text' ref={groupPass_reference}></input>
                      </div>
                    </li>
                  </ul>
                  <div className={styles.submitArea}>
                    <div className={styles.submit} onClick={() => createGroup(user)}>作成</div>
                  </div>
                  <div className={styles.spacer}></div>
                </div>

                <ul className={styles.groupList}>
                  <li>表示グループを変更する場合は"マイアカウント"から変更してください</li>
                </ul>

                <div>
                  <h3 className={styles.title}>グループの削除</h3>
                  <ul className={styles.groupList}>
                    {Object.values(currentGroup.groups).map((value, key) => {
                      if (value.groupName === "no data") {
                        return (
                          <li key={key}>グループがありません</li>
                        )
                      } else {
                        return (
                          <li key={key} className={styles.row}>
                            <div id={styles.name}>{value.groupName}</div>
                            <div id={styles.buttonField}>
                              <div className={styles.deleteButton} onClick={() => deleteGroup(value.groupId, user, key)}>削除</div>
                            </div>
                          </li>
                        )
                      }
                    })}
                  </ul>
                </div>
              </div>
            ) : (
              <Navigate to={'/firstgroupcreate'} />
            )}
          </div>
        </div>
      ) : (
        <>
          <div className='mainApp'>
            <h2 className='loading'>Loading...</h2>
          </div>
        </>
      )}
    </div>
  )
}

export default CreateGroup