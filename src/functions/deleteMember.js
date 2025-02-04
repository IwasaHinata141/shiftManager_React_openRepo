import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


export async function deleteMember(uid, groupId, docId, newList) {
  const doc_ref_member = doc(db, "Groups", groupId, "groupInfo", docId);
  setDoc(doc_ref_member, newList);
  if (docId === "member") {
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
  }
}