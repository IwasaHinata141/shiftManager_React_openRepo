import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.js";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import Edit from "../components/Edit.js";
import Status from "../components/Status.js";
import Header from "../components/Header.js";

const Member = () => {
  

  const [user, setUser] = useState([]);
  const [Info, setInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState();
  const [member, setMember] = useState([]);
  const [applicants, setApplicant] = useState([]);


  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        console.log(true);
        const uid = currentUser.uid;

        const docRef0 = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
        const docSnap0 = await getDoc(docRef0);
        const count = String(docSnap0.data().currentNum);

        const docRef1 = doc(db, "Users", uid, "MyInfo", "groups");
        const docSnap1 = await getDoc(docRef1);
        const groups = docSnap1.data()[count];
        console.log(groups.groupName !== "no data");
        if (groups.groupName !== "no data") {
          const docRef2 = doc(db, "Groups", groups.groupId, "groupInfo", "status",);
          const docSnap2 = await getDoc(docRef2);
          const status = docSnap2.data().status;

          const doc_Ref3 = doc(db, "Groups", groups.groupId, "groupInfo", "member");
          const docSnap3 = await getDoc(doc_Ref3);
          const member = docSnap3.data()

          const doc_Ref4 = doc(db, "Groups", groups.groupId, "groupInfo", "applicants");
          const docSnap4 = await getDoc(doc_Ref4);
          const applicants = docSnap4.data()

          setStatus(status);
          setMember(member);
          setApplicant(applicants);
        }

        setInfo(groups);
        console.log(groups);
        setLoading(false);
      } else {
        console.log(false);
      }

    });
  }, []);

  function handleClick(status, groupId) {
    setLoading(true)
    status = !status;
    console.log(status);
    const doc_ref_update = doc(db, "Groups", groupId, "groupInfo", "status");
    updateDoc(doc_ref_update, {
      status: status
    });
    setStatus(status);
    setLoading(false);
  }

  async function deleteMember(member, uid, groupId, docId) {
    const newMemberList = { 1: "no data" }
    var newMemberCount = 1;
    for (var count = 0; count < member.length; count++) {
      if (member[count].uid !== uid) {
        newMemberList[newMemberCount] = member[count];
        newMemberCount = newMemberCount + 1;
      }
    }
    const doc_ref_member = doc(db, "Groups", groupId, "groupInfo", docId);
    setDoc(doc_ref_member, newMemberList);
    if (docId === "member") {
      setMember(newMemberList);
      ///ここにfunctionsの関数の起動を書く必要がある(ユーザーのdocumentからgroupIdを削除する)
      const Data = {
        data: {
          userId: uid,
          groupId: groupId,
        }
      };
      const data = JSON.stringify(Data)
      console.log(data);
      const Url = 'https://delete-member-gpp774oc5q-an.a.run.app';
      const element = {
        headers: {
          "Content-Type": "application/json;"
        },
        body: data,
        method: "POST",
        mode: 'cors'
      }
      await fetch(Url, element).catch(error => console.log(error));
      window.location.reload();
    } else if (docId === "applicants") {
      setApplicant(newMemberList);
    }
  }

  async function admitMember(applicants, userData, groupId, memberdata, groupName) {
    if (memberdata["1"] === "no data") {
      const number = Object.values(memberdata).length;
      memberdata[number] = userData;
      console.log(memberdata);
      const doc_ref_member = doc(db, "Groups", groupId, "groupInfo", "member");
      updateDoc(doc_ref_member, memberdata);
      setMember(memberdata);
      deleteMember(applicants, userData.uid, groupId, "applicants");
    } else {
      const number = Object.values(memberdata).length + 1;
      memberdata[number] = userData
      const doc_ref_member = doc(db, "Groups", groupId, "groupInfo", "member");
      updateDoc(doc_ref_member, memberdata);
      setMember(memberdata);
      deleteMember(applicants, userData.uid, groupId, "applicants");
    }
    ///ここにfunctionsのadmit_memberのhttpsの起動を書く
    const Data = {
      data: {
        userId: userData.uid,
        groupId: groupId,
        groupName: groupName,
      }
    };
    const data = JSON.stringify(Data);
    console.log(data);
    const Url = 'https://admit-member-gpp774oc5q-an.a.run.app';
    const element = {
      headers: {
        "Content-Type": "application/json;"
      },
      body: data,
      method: "POST",
      mode: 'cors',
    }

    await fetch(Url, element).catch(error => console.log(error))
    
  }

  return (
    <>
      {Info.groupName === "no data" ? (
        <Navigate to={'/firstgroupcreate'} />
      ) : (
        <div>
          <div className="headerApp">
            <Header status={status} Info={Info} loading={loading} />
          </div>
          <div className="SidebarApp">
            <Sidebar />
          </div>
          <div>
            {!user ? (
              <Navigate to={`/login/`} />
            ) : (
              <div>
                <div className="mainApp">
                  
                  <Status status={status} Info={Info} handleClick={handleClick} member={member} />
                  <Edit Info={Info} member={member} applicants={applicants} deleteMember={deleteMember} admitMember={admitMember} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Member;



