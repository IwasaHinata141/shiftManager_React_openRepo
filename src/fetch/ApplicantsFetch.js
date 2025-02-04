import useSWR from "swr";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const applicantsFetcher = async (groupId) => {
  const doc_Ref = doc(db, "Groups", "6799e8a2-8e4f-4ace-9ec1-7469f76a03d2", "groupInfo","applicants",);
  const docSnap = await getDoc(doc_Ref);
  const applicants = docSnap.data();
  console.log(applicants);
  return applicants;
};


export const useApplicant = (key) => {
  const { data, error, isLoading } = useSWR(key, applicantsFetcher, { fallbackData: {"1":"no data"} });

  return {
    applicant: data,
    isApplicantsError: error,
    isApplicantsLoading: isLoading,
  };
}
