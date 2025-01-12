import React from 'react'
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect, useRef } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, } from "firebase/firestore";
import { Navigate } from "react-router-dom";

const FirstGroupCreate = () => {
  const [user, setUser] = useState([]);
  const [Info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(auth.currentUser);
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const uid = currentUser.uid;

        const docRef1 = doc(db, "Users", uid, "MyInfo", "groups");
        const docSnap1 = await getDoc(docRef1);
        const groups = docSnap1.data();

        console.log(groups["1"].groupName !== "no data");
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



  return (
    <div>

      <div>
        {!loading ? (
          <div className="firstGroupCreateApp">
            <div className='firstGroupCreateContentBox'>
              {Info["1"].groupName !== "no data" ? (
                <Navigate to={'/'} />
              ) : (
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
                      <div className='submit' onClick={() => createGroup(user.uid)}>作成</div>
                    </div>
                    <div className='spacer'></div>
                  </div>
                  <ul className='groupList'>
                    <li>ユーザーを管理するグループが必要です</li>
                    <li>グループ名・グループパスワードは後から変更可能です</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <div>Loding...</div>
          </>
        )}
      </div>

    </div>
  )
}

export default FirstGroupCreate