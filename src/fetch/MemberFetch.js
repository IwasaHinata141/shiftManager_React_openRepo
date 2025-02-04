import useSWR from "swr";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const memberAndApplicantsFetcher = async (groupId) => {
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


export const useMemberAndApplicants = (key) => {
  const { data, error, isLoading } = useSWR(key, memberAndApplicantsFetcher,{ fallbackData: {"member":{"1":"no data"},"applicants":{"1":"no data"}}});

  return {
    memberAndApplicants: data,
    isError: error,
    isLoading,
  };
}
