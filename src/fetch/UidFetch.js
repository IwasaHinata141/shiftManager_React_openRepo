import useSWR from "swr";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

const memberUidFetcher = async (memberUidKey) => {
  var contents = {};
  var shiftList = memberUidKey["shiftList"];
  var member = memberUidKey["member"];

  const memberCount = Object.keys(member).length;
  let memberList = [];
  let memberUidDoc = {};
  for (let i = 1; i <= memberCount; i++) {
    memberList.push(member[i].name);
    memberUidDoc[member[i].name] = member[i].uid;
  }
  contents["memberList"] = memberList;
  contents["memberUidDoc"] = memberUidDoc;

  let idCount = 0;
  const EventList = [];
  for (let i = 0; i < memberList.length; i++) {
    const username = memberList[i];
    const uid = memberUidDoc[username];
    const shiftData = shiftList[uid];
    if (shiftData != null) {
      var shiftDayList = Object.keys(shiftData["start"]);

      for (let j = 0; j < Object.keys(shiftData["start"]).length; j++) {
        const keyDate = shiftDayList[j];
        const startTime = shiftData["start"][keyDate]
        const endTime = shiftData["end"][keyDate]
        const calendarEventInstance = {
          id: idCount,
          title: `${username}`,
          start: `${keyDate} ${startTime}`,
          end: `${keyDate} ${endTime}`,
          backgroundColor: '#2093df',
          editable: true,
          uid: `${uid}`
        };
        EventList.push(calendarEventInstance);
        idCount++;
      }
    }
  }
  contents["EventList"] = EventList;
  return contents;
};


export const useMemberUid = (key) => {
  const { data, error, isLoading } = useSWR(key, memberUidFetcher, { fallbackData: { "memberList": ["no data"], "memberUidDoc": { "no data": "no data" }, "EventList": []} });
  return {
    memberuidData: data,
    isMemberUidError: error,
    isMemberUidLoading: isLoading,
  };
}
