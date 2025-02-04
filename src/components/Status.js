import React, { useState } from 'react'
import Modal from 'react-modal';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase.js";
import { useMemberAndApplicants } from '../fetch/MemberFetch.js';
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import { useSWRConfig } from 'swr'
import { reloadFunc, reloadStatus } from '../fetch/Reload.js';

const Status = (props) => {

  const { mutate } = useSWRConfig();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [editUser, setEditUser] = useState({});
  const [editUserName, setEditUserName] = useState();
  const [index, setIndex] = useState();

  const { currentGroup, isCurrentGroupLoading } = useGroup(props.uid);
  const { memberAndApplicants, isLoading } = useMemberAndApplicants(currentGroup.groupId);
  var member = memberAndApplicants["member"];
  var applicants = memberAndApplicants["applicants"];


  async function changeNameModal(value, key) {
    setEditUser(value);
    setEditUserName(value.name);
    setIndex(key);
    setModalIsOpen(true);
  }

  async function handleSaveName() {
    var key = String(index + 1);
    var editedUser = { [key]: { "name": editUserName, "uid": editUser.uid, "situation": editUser.situation } }
    const MemberRef = doc(db, "Groups", currentGroup.groupId, "groupInfo", "member");
    updateDoc(MemberRef, editedUser);
    var newMemberData = { ...member, ...editedUser };
    var newMemberAndApplicants = { "member": newMemberData, "applicants": applicants };
    const newData = { ...memberAndApplicants, newMemberAndApplicants };
    const options = {
      optimisticData: newData, rollbackOnError(error) {
        // タイムアウトの AbortError だった場合はロールバックしません
        return error.name !== 'AbortError'
      },
    };
    mutate(currentGroup.groupId, reloadFunc(currentGroup.groupId), options);
    setModalIsOpen(false);
  }


  function handleClick(status, groupId) {
    console.log(status);
    status = !status;
    const doc_ref_update = doc(db, "Groups", groupId, "groupInfo", "status");
    updateDoc(doc_ref_update, {
      status: status
    });
    const newStatus = { ...currentGroup, status: status };
    const options = {
      optimisticData: newStatus, rollbackOnError(error) {
        // タイムアウトの AbortError だった場合はロールバックしません
        return error.name !== 'AbortError'
      },
    };
    mutate(props.uid, reloadStatus(props.uid), options);
  }

  if (isCurrentGroupLoading || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        <div className='Modal'>
          <Modal isOpen={modalIsOpen} style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}>
            <h2>ユーザー名変更</h2>
            <div className="modal-content">
              <p>同姓同名の場合にはユーザー名を変更してください</p>
              <div className="form-group">
                <input type="text" className="form-control" id="newUserName" value={editUserName} onChange={(e) => { setEditUserName(e.target.value) }}></input>
              </div>
            </div>
            <button onClick={() => { setModalIsOpen(false) }}>キャンセル</button>
            <button onClick={handleSaveName}>保存</button>
          </Modal>
        </div>
      </div>
      <div className='StatusIndicatorBox'>
        <div className='StatusIndicator' onClick={() => handleClick(currentGroup.status, currentGroup.groupId)}>募集/停止</div>
      </div>
      <div className='memberList'>
        {member["1"] === "no data" ? (
          <p>メンバーがいません。</p>
        ) : (
          <div className='memberListBox'>
            <h3 className='title'>提出状況</h3>
            <ul>
              {Object.values(member).map((value, key) => {
                if (value.situation === "done") {
                  return (
                    <li key={key} className="row" id="done" onClick={() => changeNameModal(value, key)}>
                      <div id="name">{value.name}</div>
                      <div id="situation">{value.situation}!</div>
                    </li>
                  )
                } else {
                  return (
                    <li key={key} className="row" id="notyet" onClick={() => changeNameModal(value, key)}>
                      <div id="name">{value.name}</div>
                      <div id="situation">...{value.situation}</div>
                    </li>
                  )
                }
              })
              }
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Status