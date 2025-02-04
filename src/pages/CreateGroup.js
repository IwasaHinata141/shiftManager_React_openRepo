import React from 'react'
import Sidebar from "../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, } from "firebase/firestore";
import Header from '../components/Header.js';
import { Navigate } from "react-router-dom";
import { useGroup } from '../fetch/CurrentGroupFetch.js';


const CreateGroup = () => {
  const [user, setUser] = useState([]);

  const { currentGroup, isCurrentGroupLoading } = useGroup(user);
  console.log(isCurrentGroupLoading);

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser.uid);
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
              <div>
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
                    <div className='submit' onClick={() => createGroup(user)}>作成</div>
                  </div>
                  <div className='spacer'></div>
                </div>

                <ul className='groupList'>
                  <li>グループを変更する場合は"マイアカウント"から変更してください</li>
                </ul>

                <div>
                  <h3 className='title'>グループの削除</h3>
                  <ul className='groupList'>
                    {Object.values(currentGroup.groups).map((value, key) => {
                      if (value.groupName === "no data") {
                        return (
                          <li key={key}>グループがありません</li>
                        )
                      } else {
                        return (
                          <li key={key} className='row'>
                            <div id='name'>{value.groupName}</div>
                            <div id='buttonField'>
                              <div className='deleteButton' onClick={() => deleteGroup(value.groupId, user, key)}>削除</div>
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
          <div>Loding...</div>
        </>
      )}
    </div>
  )
}

export default CreateGroup