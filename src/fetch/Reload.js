import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

export const reloadFunc = async (groupId) => {
  var memberAndApplicants = {};
  const docRef1 = doc(db, "Groups", groupId, "groupInfo", "member");
  const docSnap1 = await getDoc(docRef1);
  const member = docSnap1.data();
  const docRef2 = doc(db, "Groups", groupId, "groupInfo", "applicants");
  const docSnap2 = await getDoc(docRef2);
  const applicants = docSnap2.data();
  memberAndApplicants["member"] = member;
  memberAndApplicants["applicants"] = applicants;
  return memberAndApplicants;
};

export const reloadStatus = async (uid) => {
  const docRef1 = doc(db, "Users", uid, "MyInfo", "currentGroupNum");
  const docSnap1 = await getDoc(docRef1);
  const count = docSnap1.data()["currentNum"];

  const docRef2 = doc(db, "Users", uid, "MyInfo", "groups");
  const docSnap2 = await getDoc(docRef2);
  const groups = docSnap2.data();
  const group = docSnap2.data()[count];
  group.groups = groups;
  group.count = count;

  const docRef3 = doc(db, "Groups", group.groupId, "groupInfo", "status",);
  const docSnap3 = await getDoc(docRef3);
  const status = docSnap3.data().status;
  group.status = status;

  const docRef4 = doc(db, "Groups", group.groupId, "groupInfo", "RequestShiftList",);
  const docSnap4 = await getDoc(docRef4);
  const RequestShiftList = docSnap4.data();
  group.RequestShiftList = RequestShiftList;

  return group;
}
