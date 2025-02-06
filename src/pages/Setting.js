import React from 'react'
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Header from '../components/Header.js';
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import { reloadStatus } from '../fetch/Reload.js';
import { useSWRConfig } from 'swr'
import { useNavigate } from "react-router-dom";

const Setting = () => {
  const { mutate } = useSWRConfig();
  const [user, setUser] = useState([]);
  const [username, setUsername] = useState("");
  const { currentGroup, isCurrentGroupLoading } = useGroup(user.uid);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser){
        setUser(currentUser);
        const docRef2 = doc(db, "Users", currentUser.uid, "MyInfo", "userInfo");
        const docSnap2 = await getDoc(docRef2);
        const username = docSnap2.data().username;
        setUsername(username);
      }else{
        console.log("no user");
        navigate('/login');
      }
    });
  });

  // const newName_reference = useRef();

  async function changeGroup(target, uid) {
    const inputNum = Number(target + 1);

    const document = {
      currentNum: inputNum,
    }
    const tableRequestRef = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
    await updateDoc(tableRequestRef, document);

    const newCount = { ...currentGroup, count: inputNum };
    const options = {
      optimisticData: newCount, rollbackOnError(error) {
        // タイムアウトの AbortError だった場合はロールバックしません
        return error.name !== 'AbortError'
      },
    };
    mutate(uid, reloadStatus(uid), options);
  }

  // function changeInfo(Info, user) {

  //   const userInfoRef = doc(db, "Users", user.uid, "MyInfo", "userInfo");
  //   updateDoc(userInfoRef, {
  //     username: newName_reference.current.value
  //   });

  //   console.log(Object.values(Info).length);

  //   for (var i = 1; i <= Object.values(Info).length; i++) {
  //     const passRef = doc(db, "Groups", Info[i].groupId, "groupInfo", "pass");
  //     updateDoc(passRef, {
  //       adminName: newName_reference.current.value
  //     });
  //   }
  //   setUsername(newName_reference.current.value);
  //   newName_reference.current.value = "";
  // }

  return (
    <div>
      <div className="headerApp">
        <Header uid={user.uid} />
      </div>
      <div className="SidebarApp">
        <Sidebar />
      </div>
      {!isCurrentGroupLoading ? (
        <div>
          <div className="mainApp">
            <h3>グループ変更</h3>
            <ul>
              {Object.values(currentGroup.groups).map((value, key) => {
                return (
                  <li key={key}>
                    <label>
                      <input
                        type='radio'
                        checked={currentGroup.count === Number(key + 1)}
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
              {/* <div className='editMyAccount'>
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
              </div> */}
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

export default Setting