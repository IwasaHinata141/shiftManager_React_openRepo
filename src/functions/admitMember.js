import { deleteMember } from "./deleteMember";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";


export async function admitMember(uid, groupId, memberdata, groupName, newApplicantsList) {
  try {
    const doc_ref_member = doc(db, "Groups", groupId, "groupInfo", "member");
    await setDoc(doc_ref_member, memberdata);
    deleteMember(uid, groupId, "applicants", newApplicantsList);


    ///ここにfunctionsのadmit_memberの起動を書く
    const Data = {
      data: {
        userId: uid,
        groupId: groupId,
        groupName: groupName,
      }
    };
    const data = JSON.stringify(Data);
    console.log(data);
    const Url = 'https://admit-member-gpp774oc5q-an.a.run.app';
    const element = {
      headers: {
        "Content-Type": "application/json;"
      },
      body: data,
      method: "POST",
      mode: 'cors',
    }

    await fetch(Url, element).catch(error => console.log(error))
    console.log("success");
  } catch (e) {
    console.error(e);
  }

}