import React from 'react'
import Sidebar from "../components/Sidebar.js";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Header from '../components/Header.js';
import { Calendar } from "../components/Calendar.js";
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import styles from '../css/Shift.module.css';
import { useNavigate } from "react-router-dom";

const Shift = () => {
  const [days, setdays] = useState();
  const [user, setUser] = useState([]);

  const title_reference = useRef();
  const start_reference = useRef();
  const end_reference = useRef();
  const message_reference1 = useRef();

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

  async function uploadRequest(groupId) {
    console.log(groupId);
    const document = {
      tableTitle: title_reference.current.value,
      start: start_reference.current.value,
      end: end_reference.current.value,
      message: message_reference1.current.value
    }
    const tableRequestRef = doc(db, "Groups", groupId, "groupInfo", "tableRequest");
    await setDoc(tableRequestRef, document);
    const setStatusRef = doc(db, "Groups", groupId, "groupInfo", "status");
    await updateDoc(setStatusRef, { status: true });
  }

  function calculate() {
    const start = start_reference.current.valueAsDate;
    const end = end_reference.current.valueAsDate;
    if (start != null && end != null) {
      const diffMilliSec = end - start;
      const days = parseInt(diffMilliSec / 1000 / 60 / 60 / 24);
      setdays(days);
    }

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
        <div>
          <div className='calendar'>
            <Calendar user={user} />
          </div>
          <div>

            <div className={styles.shiftPage}>
              <div className={styles.shiftBox}>
                <h3 className={styles.title}>シフト募集</h3>
                <h4>要件入力</h4>
                <ul className={styles.inputItemBox}>
                  <li className={styles.inputItem}>
                    <div id={styles.item}>タイトル</div>
                    <div id={styles.value} >
                      <input type='text' ref={title_reference}></input>
                    </div>
                  </li>
                  <li className={styles.inputItem}>
                    <div id={styles.item}>日程</div>
                    <div id={styles.value}>
                      <div className={styles.dateTitle}>開始日：</div>
                      <input type='date' onChange={() => calculate()} ref={start_reference}></input>
                      <div></div>
                      <div className={styles.dateTitle}>終了日：</div>
                      <input type='date' onChange={() => calculate()} ref={end_reference}></input>
                    </div>
                  </li>
                  <li className={styles.inputItem}>
                    <div id={styles.item}>日数</div>
                    <div id={styles.value}>{days}</div>
                  </li>
                  <li className={styles.inputItem}>
                    <div id={styles.item}>メッセージ</div>
                    <div id={styles.value}>
                      <textarea className={styles.textArea} rows={5} cols={50} ref={message_reference1} />
                    </div>
                  </li>
                </ul>
                <p>※日数は最大で31日間までです。</p>
                <br />
                <div className={styles.submitArea}>
                  <div className={styles.submit} onClick={() => uploadRequest(currentGroup.groupId)}>送信</div>
                </div>
              </div>
            </div>
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

export default Shift;