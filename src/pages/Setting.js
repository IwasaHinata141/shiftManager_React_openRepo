import React from 'react'
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from '../components/Header.js';

const Setting = () => {
  const [user, setUser] = useState([]);
  const [Info, setInfo] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [num, setNum] = useState();
  const [status, setStatus] = useState();


  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;

        const docRef0 = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
        const docSnap0 = await getDoc(docRef0);
        const count = Number(docSnap0.data().currentNum);

        const docRef1 = doc(db, "Users", uid, "MyInfo", "groups");
        const docSnap1 = await getDoc(docRef1);
        const groups = docSnap1.data();

        const docRef2 = doc(db, "Users", uid, "MyInfo", "userInfo");
        const docSnap2 = await getDoc(docRef2);
        const username = docSnap2.data().username;

        const docRef3 = doc(db, "Groups", groups[count].groupId, "groupInfo", "download",);
        const docSnap3 = await getDoc(docRef3);
        const status = docSnap3.data().status;

        setInfo(groups);
        setNum(count);
        setUsername(username);
        setStatus(status);
        setLoading(false);
      }

    });
  }, []);

  const newName_reference = useRef();

  async function changeGroup(target, uid) {
    const inputNum = Number(target + 1);

    const document = {
      currentNum: inputNum,
    }
    const tableRequestRef = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
    await updateDoc(tableRequestRef, document);

    setNum(inputNum);
    window.location.reload();
    console.log("done");
  }

  function changeInfo(Info, user) {

    const userInfoRef = doc(db, "Users", user.uid, "MyInfo", "userInfo");
    updateDoc(userInfoRef, {
      username: newName_reference.current.value
    });

    console.log(Object.values(Info).length);

    for (var i = 1; i <= Object.values(Info).length; i++) {
      const passRef = doc(db, "Groups", Info[i].groupId, "groupInfo", "pass");
      updateDoc(passRef, {
        adminName: newName_reference.current.value
      });
    }
    setUsername(newName_reference.current.value);
    newName_reference.current.value = "";
  }

  return (
    <div>
      <div className="headerApp">
        <Header status={status} Info={Info[num]} loading={loading}/>
      </div>
      <div className="SidebarApp">
        <Sidebar />
      </div>
      {!loading ? (
        <div>
          <div className="mainApp">
            <h3>グループ変更</h3>
            <ul>
              {Object.values(Info).map((value, key) => {
                return (
                  <li key={key}>
                    <label>
                      <input
                        type='radio'
                        checked={num === Number(key + 1)}
                        onChange={() => changeGroup(key, user.uid)}
                      />
                      {value.groupName}  グループID：{value.groupId}
                    </label>
                  </li>
                )
              })}
            </ul>

            <div>
              <div className="myAccount">
                <h4>マイアカウント</h4>
                <ul>
                  <li>名前：{username}</li>
                  <li>アドレス：{user.email}</li>
                </ul>
              </div>
              <div className='editMyAccount'>
                <h3>ユーザー情報編集</h3>
                <ul>
                  <li>
                    <label htmlFor='changeName'>
                      新しい名前：
                      <input type='text' id='changeName' ref={newName_reference} />
                    </label>
                  </li>
                </ul>
                <button onClick={() => changeInfo(Info, user)}>決定</button>
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

export default Setting