import React from 'react'
import { useGroup } from '../fetch/CurrentGroupFetch'

const Header = (props) => {

  const { currentGroup, isCurrentGroupLoading } = useGroup(props.uid);


  return (
    <div className="header">
      <h1>shiftManager Console</h1>

      {!isCurrentGroupLoading && currentGroup ? (
        <div className='currentGroupInfo'>
          <p className='groupname'>{currentGroup.groupName}</p>
          <div>
            {currentGroup.status ? (
              <p>募集中</p>
            ) : (
              <p>停止中</p>
            )}
          </div>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  )
}

export default Header