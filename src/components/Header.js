import React from 'react'

const Header = (props) => {
  return (
    <div className="header">
      <h1>shiftManager Console</h1>

      {!props.loading ? (
        <div className='currentGroupInfo'>
        <p className='groupname'>{props.Info.groupName}</p>
        <div>
        {props.status ? (
        <p>募集中</p>
      ) : (
        <p>停止中</p>
      )}
        </div>
      </div>
      ):(
        <div>取得中..</div>
      )}
      

    </div>
  )
}

export default Header