import React from 'react'
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, } from "firebase/firestore";
import Header from '../components/Header.js';
import { Navigate } from "react-router-dom";

const CreateGroup = () => {
  const [user, setUser] = useState([]);
  const [Info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState();
  const [currentgroup, setCurrentGroup] = useState([]);



  useEffect(() => {
    console.log(auth.currentUser);
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;
        const docRef0 = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
        const docSnap0 = await getDoc(docRef0);
        const count = String(docSnap0.data().currentNum);

        const docRef1 = doc(db, "Users", uid, "MyInfo", "groups");
        const docSnap1 = await getDoc(docRef1);
        const groups = docSnap1.data();

        if (groups[1].groupId !== "no data") {
          const docRef2 = doc(db, "Groups", groups[count].groupId, "groupInfo", "download",);
          const docSnap2 = await getDoc(docRef2);
          const status = docSnap2.data().status;
          setStatus(status);
        }


        console.log(groups["1"].groupId !== "no data");
        setCurrentGroup(groups[count])
        setInfo(groups);
        setLoading(false);
      }

    });
  }, []);

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
        <Header status={status} Info={currentgroup} loading={loading} />
      </div>
      <div className="SidebarApp">
        <Sidebar />
      </div>
      {!loading ? (
        <div className="mainApp">
          <div className='manageGroup'>
            {Info["1"].groupId !== "no data" ? (
              ///グループがある場合
              <div>
                {(3 - Object.keys(Info).length) !== 0 ? (
                  <div>
                    <h4 className='title'>新規グループの作成</h4>
                    <ul className='inputItemBox'>
                      <li className='inputItem'>
                        <div id='item' >グループ名</div>
                        <input type='text' ref={groupName_reference} id="value"></input>
                      </li>
                      <li className='inputItem'>
                        <div id='item'>グループパスワード</div>
                        <input type='text' ref={groupPass_reference} id="value"></input>
                      </li>
                    </ul>
                    <div className='submitArea'>
                      <div className='submit' onClick={() => createGroup(user.uid)}>作成</div>
                    </div>
                    <div className='spacer'></div>
                  </div>
                ) : (
                  <div>
                    <p>グループ数が上限に達しています。</p>
                  </div>
                )}
                <ul className='groupList'>
                  <li>※管理できるグループは3つまでです（残り{3 - Object.keys(Info).length}つ）</li>
                  <li>グループを変更する場合は"マイアカウント"から変更してください</li>
                </ul>

                <div>
                  <h3 className='title'>グループの削除</h3>
                  <ul className='groupList'>
                    {Object.values(Info).map((value, key) => {
                      return (
                        <li key={key} className='row'>
                          <div id='name'>{value.groupName}</div>
                          <div id='buttonField'>
                            <div className='deleteButton' onClick={() => deleteGroup(value.groupId, user.uid, key)}>削除</div>
                          </div>
                        </li>
                      )
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
          <div>Loding...</div>
        </>
      )}
    </div>
  )
}

export default CreateGroup