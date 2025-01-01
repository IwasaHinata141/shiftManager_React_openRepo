import React from 'react'
import { v4 as uuidv4 } from "uuid";

const Download = (props) => {

  return (
    <div>
      {!props.loading ? (
        <div>
          <div className="downloadUploadPage">
            <h3 className='title'>ダウンロード/アップロード</h3>
            <div className='container'>
              <div className='infoBox'>
                <p>ダウンロードしたファイルを編集し、シフト表を下部のアップロードフォームよりアップロードしてください</p>
                <p>※ダウンロードを行う際は、必ず募集状況を停止中にしてから行ってください。</p>
                <p>
                ※一部編集禁止の範囲があります。詳しくはこちらを参考にしてください。<br></br>
                これらの範囲以外を編集した場合、グループメンバーにデータが適切に反映されなくなる可能性があります。</p>
              </div>
            </div>
            <div className='downloadButtonBox'>
              <div className='downloadButton' key={uuidv4()} onClick={() => props.downloadFile(props.link)}>ダウンロード</div>
            </div>
            <div className='container'>
              <div className='infoBox'>
                <p>※対応しているファイル形式はxlsxのみです。他のファイル形式をアップロードしないで下さい。</p>
                <p>アップロード後グループメンバーにシフトが反映されるまで、少々遅延が発生します。</p>
              </div>
            </div>
            <div className='fileReception'>
              <input type="file" accept=".xlsx" className='choiceFile' ref={props.file_reference}></input>
            </div>
            <div className='uploadButtonBox'>
              <div className='uploadButton' onClick={() => props.uploadFile(props.Info.groupId)}>アップロード</div>
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