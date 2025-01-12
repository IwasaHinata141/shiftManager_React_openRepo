import React from 'react'
import Sidebar from "../components/Sidebar.js";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Download from '../components/Download.js';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import Header from '../components/Header.js';
import { Calendar } from "../components/Calendar.js";

const Shift = () => {
  const [Info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [link, setLinks] = useState();
  const [status, setStatus] = useState();
  const [days, setdays] = useState();
  const [shiftList, setShiftList] = useState();
  const [memberList, setMemberList] = useState([]);
  const [memberUidDoc, setMemberUidDoc] = useState({});
  const [user, setUser] = useState([]);

  const title_reference = useRef();
  const start_reference = useRef();
  const end_reference = useRef();
  const message_reference1 = useRef();

  const file_reference = useRef();
  const message_reference2 = useRef();
  const storage = getStorage();
  const storageRef = ref(storage, 'Groups/');


  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;

        const docRef0 = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
        const docSnap0 = await getDoc(docRef0);
        const count = String(docSnap0.data().currentNum);

        const docRef1 = doc(db, "Users", uid, "MyInfo", "groups");
        const docSnap1 = await getDoc(docRef1);
        const groups = docSnap1.data()[count];

        const docRef2 = doc(db, "Groups", groups.groupId, "groupInfo", "download",);
        const docSnap2 = await getDoc(docRef2);
        const downloadLink = docSnap2.data().downloadLink;

        const docRef3 = doc(db, "Groups", groups.groupId, "groupInfo", "status",);
        const docSnap3 = await getDoc(docRef3);
        const status = docSnap3.data().status;

        const docRef4 = doc(db, "Groups", groups.groupId, "groupInfo", "RequestShiftList",);
        const docSnap4 = await getDoc(docRef4);
        const RequestShiftList = docSnap4.data();

        const docRef5 = doc(db, "Groups", groups.groupId, "groupInfo", "member",);
        const docSnap5 = await getDoc(docRef5);
        const member = docSnap5.data();
        const memberCount = Object.keys(member).length;
        let memberList = [];
        let memberUidDoc = {};
        for (let i = 1; i <= memberCount; i++) {
          memberList.push(member[i].name);
          memberUidDoc[member[i].name] = member[i].uid;
        }

        setMemberList(memberList);
        setMemberUidDoc(memberUidDoc);
        setShiftList(RequestShiftList);
        setInfo(groups);
        setLinks(downloadLink);
        setStatus(status);
        setLoading(false);
      }
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
    window.location.reload();
    setStatus(true);
  }

  function downloadFile(link) {
    window.open(link);
  }
  /*
  function uploadFile(groupId) {
    console.log(groupId);
    if (file_reference.current.files[0] !== undefined) {
      console.log(file_reference.current.files[0]);
      const file = file_reference.current.files[0];
      const filePath = `${groupId}/completed/${new Date().getTime()}_${file.name}`;
      const fullStorageRef = ref(storageRef, filePath);
      console.log(fullStorageRef);
      uploadBytes(fullStorageRef, file).then(() => {
        console.log('Uploaded a file!');
      });
    }
  }*/
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
        <Header status={status} Info={Info} loading={loading} />
      </div>
      <div className="SidebarApp">
        <Sidebar />
      </div>
      {!loading ? (
        <div>
          <div className='calendar'>
            <Calendar memberList={memberList} shiftList={shiftList} memberUidDoc={memberUidDoc} groupId={Info.groupId} groupName={Info.groupName} user={user} />
          </div>
          <div>

            <div className='shiftPage'>
              {/*<div className='downloadBox'>
                <Download Info={Info} loading={loading} link={link} downloadFile={downloadFile} />
              </div>*/}
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
                    <div id='value'>{days}日</div>
                  </li>
                  <li className='inputItem'>
                    <div id='item'>メッセージ</div>
                    <textarea name="content" id='value' rows={5} cols={50} ref={message_reference1} />
                  </li>
                </ul>
                <p>※日数は最大で31日間までです。</p>
                <br />
                <div className='submitArea'>
                  <div className='submit' onClick={() => uploadRequest(Info.groupId)}>送信</div>
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