import React from 'react'


const Edit = (props) => {

  return (
    <div>
      <div className='memberList'>
        <h3 className='title'>グループメンバー編集</h3>
        {props.member["1"] === "no data" ? (
          <div className='memberListBox'>
            <p>メンバーがいません。</p>
          </div>
        ) : (
          <div className='memberListBox'>
            <ul>  
              {Object.values(props.member).map((value, key) => {
                return (
                  <li key={key} className="row">
                    <div id="name">{value.name}</div>
                    <div id='buttonField'>
                      <div className='deleteButton' onClick={() => props.deleteMember(
                        Object.values(props.member),
                        value.uid,
                        props.Info.groupId,
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
        {props.applicants["1"] === "no data" ? (
          <div className='memberListBox'>
            <div>申請者はいません</div>
          </div>
        ) : (
          <div className='memberListBox'>
            <ul>
              {Object.values(props.applicants).map((value, key) => {
                return (
                  <li key={key} className="row">
                    <div id="name">{value.name}</div>
                    <div id='buttonField'>
                      <div id='insideField'>
                        <div className='addButton' onClick={() => props.admitMember(
                          Object.values(props.applicants),
                          value,
                          props.Info.groupId,
                          props.member,
                          props.Info.groupName,
                        )}>承認</div>
                        <div className='refuseButton' onClick={() => props.deleteMember(
                          Object.values(props.applicants),
                          value.uid,
                          props.Info.groupId,
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