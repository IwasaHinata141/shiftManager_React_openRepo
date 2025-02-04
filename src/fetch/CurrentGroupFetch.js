import useSWR from "swr";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const groupFetcher = async (uid) => {
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
  console.log(group);



  return group;
};


export const useGroup = (key) => {
  const { data, error, isLoading } = useSWR(key, groupFetcher, { fallbackData: { "RequestShiftList": { "no data": null }, "groups": { "1": { "groupName": "no data", "groupId": "no data", "groupPass": "no data" }} } });

  return {
    currentGroup: data,
    isCurrentGroupError: error,
    isCurrentGroupLoading: isLoading,
  };
}
