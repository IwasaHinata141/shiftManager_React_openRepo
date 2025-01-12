import React from 'react'
import { v4 as uuidv4 } from "uuid";

const Download = (props) => {

  return (
    <div>
      {!props.loading ? (
        <div>
          <div className="downloadUploadPage">
            <h3 className='title'>ダウンロード</h3>
            <div className='container'>
              <div className='infoBox'>
                <p>※保存済みのシフトからExcelファイルを生成し、ダウンロードできます。</p>
              </div>
            </div>
            <div className='downloadButtonBox'>
              <div className='downloadButton' key={uuidv4()} onClick={() => props.downloadFile(props.link)}>ダウンロード</div>
            </div>
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

export default Download