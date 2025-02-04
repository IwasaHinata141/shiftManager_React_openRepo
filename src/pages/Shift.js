import React from 'react'
import Sidebar from "../components/Sidebar.js";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import Header from '../components/Header.js';
import { Calendar } from "../components/Calendar.js";
import { useGroup } from '../fetch/CurrentGroupFetch.js';


const Shift = () => {
  const [days, setdays] = useState();
  const [user, setUser] = useState([]);

  const title_reference = useRef();
  const start_reference = useRef();
  const end_reference = useRef();
  const message_reference1 = useRef();

  const { currentGroup, isCurrentGroupLoading } = useGroup(user);


  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser.uid);
    });
  }, []);

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

            <div className='shiftPage'>
              <div className='shiftBox'>
                <h3 className='title'>シフト募集</h3>
                <h4>要件入力</h4>
                <ul className='inputItemBox'>
                  <li className='inputItem'>
                    <div id='item'>タイトル</div>
                    <div id='value' >
                      <input type='text' ref={title_reference}></input>
                    </div>
                  </li>
                  <li className='inputItem'>
                    <div id='item'>日程</div>
                    <div id='value'>
                      <div>開始日：</div>
                      <input type='date' onChange={() => calculate()} ref={start_reference}></input>

                      <div>終了日：</div>
                      <input type='date' onChange={() => calculate()} ref={end_reference}></input>
                    </div>
                  </li>
                  <li className='inputItem'>
                    <div id='item'>日数</div>
                    <div id='value'>{days}</div>
                  </li>
                  <li className='inputItem'>
                    <div id='item'>メッセージ</div>
                    <textarea name="content" id='value' rows={5} cols={50} ref={message_reference1} />
                  </li>
                </ul>
                <p>※日数は最大で31日間までです。</p>
                <br />
                <div className='submitArea'>
                  <div className='submit' onClick={() => uploadRequest(currentGroup.groupId)}>送信</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div>Loding...</div>
        </>
      )}
    </div>
  )
}

export default Shift;