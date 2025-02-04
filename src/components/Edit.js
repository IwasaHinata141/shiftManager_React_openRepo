import React from 'react'
import { useMemberAndApplicants } from '../fetch/MemberFetch.js';
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import { admitMember } from '../functions/admitMember.js';
import { useSWRConfig } from 'swr'
import { reloadFunc } from '../fetch/Reload.js';
import { deleteMember } from '../functions/deleteMember.js';

const Edit = (props) => {

  const { mutate } = useSWRConfig();
  const { currentGroup, isCurrentGroupLoading } = useGroup(props.uid);

  const { memberAndApplicants, isLoading, } = useMemberAndApplicants(currentGroup.groupId);
  const member = memberAndApplicants["member"];
  const applicants = memberAndApplicants["applicants"];
  console.log(memberAndApplicants);


  async function handleAdmitMember(applicants, userData, groupId, memberdata, groupName) {
    try {
      const uid = userData.uid;
      if (memberdata["1"] === "no data") {
        const number = Object.values(memberdata).length;
        memberdata[number] = userData;
        console.log(memberdata);
      } else {
        const number = Object.values(memberdata).length + 1;
        memberdata[number] = userData
      }
      var newApplicantsList = { 1: "no data" }
      var newApplicantsCount = 1;
      for (var count = 0; count < applicants.length; count++) {
        if (applicants[count].uid !== uid) {
          newApplicantsList[newApplicantsCount] = applicants[count];
          newApplicantsCount = newApplicantsCount + 1;
        }
      }
      var newMemberAndApplicants = { "member": memberdata, "applicants": newApplicantsList };

      admitMember(uid, groupId, memberdata, groupName, newApplicantsList);
      const newData = { ...memberAndApplicants, newMemberAndApplicants };
      const options = {
        optimisticData: newData, rollbackOnError(error) {
          // タイムアウトの AbortError だった場合はロールバックしません
          return error.name !== 'AbortError'
        },
      };
      mutate(currentGroup.groupId, reloadFunc(currentGroup.groupId), options);
      const responce = reloadFunc(currentGroup.groupId);
      console.log(responce);

    } catch (e) {
      console.error(e);
    }
  }

  async function handleDeleteMember(members, uid, groupId, docId) {
    try {
      const newList = { 1: "no data" }
      var newCount = 1;
      for (var count = 0; count < members.length; count++) {
        if (members[count].uid !== uid) {
          newList[newCount] = members[count];
          newCount = newCount + 1;
        }
      }
      if (docId === "member") {
        var newMemberAndApplicants = { "member": newList, "applicants": applicants };
      } else if (docId === "applicants") {
        var newMemberAndApplicants = { "member": member, "applicants": newList };
      } else {
        var newMemberAndApplicants = { "member": member, "applicants": applicants };
      }
      deleteMember(uid, groupId, docId, newList);
      const newData = { ...memberAndApplicants, newMemberAndApplicants };
      const options = {
        optimisticData: newData, rollbackOnError(error) {
          // タイムアウトの AbortError だった場合はロールバックしません
          return error.name !== 'AbortError'
        },
      };
      mutate(currentGroup.groupId, reloadFunc(currentGroup.groupId), options);
    } catch (e) {
      console.error(e);
    }

  }

  if (isCurrentGroupLoading || isLoading) {
    return <div></div>;
  }

  return (
    <div>
      <div className='memberList'>
        <h3 className='title'>グループメンバー編集</h3>
        {member["1"] === "no data" ? (
          <div className='memberListBox'>
            <p>メンバーがいません。</p>
          </div>
        ) : (
          <div className='memberListBox'>
            <ul>
              {Object.values(member).map((value, key) => {
                return (
                  <li key={key} className="row">
                    <div id="name">{value.name}</div>
                    <div id='buttonField'>
                      <div className='deleteButton' onClick={() => handleDeleteMember(
                        Object.values(member),
                        value.uid,
                        currentGroup.groupId,
                        "member"
                      )}>削除</div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
      <p className='Info'>下記は参加申請を送ってきたユーザーの一覧です。グループに追加する場合は"承認"ボタンを、グループに追加しない場合は"拒否"ボタンを押してください</p>
      <div className='memberList'>
        <h3 className='title'>申請者一覧</h3>
        {applicants["1"] == "no data" ? (
          <div className='memberListBox'>
            <div>申請者はいません</div>
          </div>
        ) : (
          <div className='memberListBox'>
            <ul>
              {Object.values(applicants).map((value, key) => {
                return (
                  <li key={key} className="row">
                    <div id="name">{value.name}</div>
                    <div id='buttonField'>
                      <div id='insideField'>
                        <div className='addButton' onClick={() => handleAdmitMember(
                          Object.values(applicants),
                          value,
                          currentGroup.groupId,
                          member,
                          currentGroup.groupName,
                        )}>承認</div>
                        <div className='refuseButton' onClick={() => handleDeleteMember(
                          Object.values(applicants),
                          value.uid,
                          currentGroup.groupId,
                          "applicants"
                        )}>拒否</div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Edit