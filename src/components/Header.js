import React from 'react'
import { useGroup } from '../fetch/CurrentGroupFetch'
import styles from '../css/Header.module.css'

const Header = (props) => {

  const { currentGroup, isCurrentGroupLoading } = useGroup(props.uid);


  return (
    <div className={styles.header}>
      <h1>shiftManager Console</h1>

      {!isCurrentGroupLoading && currentGroup ? (
        <div>
          <p>{currentGroup.groupName}</p>
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