import React from 'react'

const Status = (props) => {
  return (
    <div>
      <div className='StatusIndicatorBox'>
        <div className='StatusIndicator' onClick={() => props.handleClick(props.status, props.Info.groupId)}>募集/停止</div>
      </div>
      <div className='memberList'>
        {props.member["1"] === "no data" ? (
          <p>メンバーがいません。</p>
        ) : (
          <div className='memberListBox'>
            <h3 className='title'>提出状況</h3>
            <ul>
              {Object.values(props.member).map((value, key) => {
                if (value.situation === "done") {
                  return (
                    <li key={key} className="row" id="done">
                      <div id="name">{value.name}</div>
                      <div id="situation">{value.situation}!</div>
                    </li>
                  )
                } else {
                  return (
                    <li key={key} className="row" id="notyet">
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