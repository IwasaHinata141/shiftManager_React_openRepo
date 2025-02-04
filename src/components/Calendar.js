import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { useState } from "react";
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase.js";
import { useMemberUid } from '../fetch/UidFetch.js';
import { useGroup } from '../fetch/CurrentGroupFetch.js';
import { useSWRConfig } from 'swr';
import { useMemberAndApplicants } from '../fetch/MemberFetch.js';


Modal.setAppElement('#root');



export const Calendar = (props) => {
  var memberUidKey = {};
  const uid = props.user;

  const { mutate } = useSWRConfig();
  const { currentGroup, isCurrentGroupLoading } = useGroup(uid);
  const { memberAndApplicants, isLoading, } = useMemberAndApplicants(currentGroup.groupId);
  memberUidKey["shiftList"] = currentGroup.RequestShiftList;
  memberUidKey["member"] = memberAndApplicants["member"]; 
  const { memberuidData, isMemberUidLoading } = useMemberUid(memberUidKey);
  const memberList = memberuidData["memberList"];
  const memberUidDoc = memberuidData["memberUidDoc"];
  const calendarEventsData = memberuidData["EventList"];


  // モーダルの起動
  const [modalIsOpenEventClick, setModalIsOpenEventClick] = useState(false);
  const [modalIsOpenDateClick, setModalIsOpenDateClick] = useState(false);
  // 日付の選択
  const [selectDay, setSelectedDay] = useState();
  // 選択されたメンバー
  const [selectedOption, setSelectedOption] = useState(memberList[0]);
  // イベントの開始時刻と終了時刻
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  // イベントの名前
  const [eventUserName, setEventUserName] = useState("");
  // イベントのID
  const [eventId, setEventId] = useState();



  const handleDateClick = (e) => {
    setSelectedDay(e.dateStr);
    setSelectedOption(memberList[0])
    setModalIsOpenDateClick(true);
  }
  const handleEventClick = (arg) => {
    const dateStr = arg.event.startStr.split("T")[0];
    const startTimeflagment = arg.event.startStr.split("T")[1].split(":");
    const startTimeStr = startTimeflagment[0] + ":" + startTimeflagment[1];
    const endTimeflagment = arg.event.endStr.split("T")[1].split(":");
    const endTimeStr = endTimeflagment[0] + ":" + endTimeflagment[1];
    setEventId(arg.event.id);
    setStartTime(startTimeStr);
    setEndTime(endTimeStr);
    setSelectedDay(dateStr);
    setEventUserName(arg.event.title);

    setModalIsOpenEventClick(true);
  }

  /*--既にあるイベントの編集と追加--*/
  const handleSaveEvent = async () => {
    // イベントデータをサーバーに送信する処理
    setModalIsOpenEventClick(false);
    const start = new Date(`${selectDay}T${startTime}:00.000+09:00`);
    const end = new Date(`${selectDay}T${endTime}:00.000+09:00`);
    const uid = memberUidDoc[eventUserName];
    var newCalendarEvent = [];
    var newCalendarEventInstance = {};
    if (end > start) {
      newCalendarEventInstance = {
        id: Number(eventId),
        title: `${eventUserName}`,
        start: `${selectDay} ${startTime}`,
        end: `${selectDay} ${endTime}`,
        backgroundColor: '#2093df',
        editable: true,
        uid: `${uid}`
      };
    } else {
      var nextDate = new Date(selectDay);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDay = nextDate.toISOString().slice(0, 10);
      newCalendarEventInstance = {
        id: Number(eventId),
        title: `${eventUserName}`,
        start: `${selectDay} ${startTime}`,
        end: `${nextDay} ${endTime}`,
        backgroundColor: '#2093df',
        editable: true,
        uid: `${uid}`
      };
    }

    calendarEventsData.map((value, index) => {
      newCalendarEvent.push(index === Number(eventId) ? newCalendarEventInstance : value);
    });


    mutate(memberUidKey, { "memberList": memberList, "EventList": newCalendarEvent, "memberUidDoc": memberUidDoc }, false);
    try {
      await submitShiftData(newCalendarEvent);
    } catch (error) {
      console.error('Error deleting event:', error);

      // エラーが発生した場合、キャッシュを元に戻す
      mutate(memberUidKey, calendarEventsData, false);
    };
  };




  /*--新しいイベントの追加--*/
  const handleSaveNewEvent = async () => {
    setModalIsOpenDateClick(false);
    const start = new Date(`${selectDay}T${startTime}:00.000+09:00`);
    const end = new Date(`${selectDay}T${endTime}:00.000+09:00`);
    const uid = memberUidDoc[selectedOption];
    var newCalendarEvent = [];
    var newCalendarEventInstance = {};
    if (end > start) {
      newCalendarEventInstance = {
        id: calendarEventsData.length,
        title: `${selectedOption}`,
        start: `${selectDay} ${startTime}`,
        end: `${selectDay} ${endTime}`,
        backgroundColor: '#2093df',
        editable: true,
        uid: `${uid}`
      };
    } else {
      var nextDate = new Date(selectDay);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextDay = nextDate.toISOString().slice(0, 10);
      newCalendarEventInstance = {
        id: calendarEventsData.length,
        title: `${selectedOption}`,
        start: `${selectDay} ${startTime}`,
        end: `${nextDay} ${endTime}`,
        backgroundColor: '#2093df',
        editable: true,
        uid: `${uid}`
      };
    };
    calendarEventsData.map((value, index) => {
      newCalendarEvent.push(value);
    });
    newCalendarEvent.push(newCalendarEventInstance);


    mutate(memberUidKey, { "memberList": memberList, "EventList": newCalendarEvent, "memberUidDoc": memberUidDoc }, false);
    try {
      await submitShiftData(newCalendarEvent);
    } catch (error) {
      console.error('Error deleting event:', error);

      // エラーが発生した場合、キャッシュを元に戻す
      mutate(memberUidKey, calendarEventsData, false);
    };
  };

  const deleteEvent = async () => {
    setModalIsOpenEventClick(false)
    var newCalendarEvent = [];
    var checker = false;
    calendarEventsData.map((value, index) => {
      if (index !== Number(eventId) && checker === false) {
        newCalendarEvent.push(value);
      } else if (index !== Number(eventId) && checker === true) {
        value["id"] = index - 1;
        newCalendarEvent.push(value);
      } else if (index === Number(eventId)) {
        checker = true;
      }
    });

    mutate(memberUidKey, { "memberList": memberList, "EventList": newCalendarEvent, "memberUidDoc": memberUidDoc }, false);
    try {
      await submitShiftData(newCalendarEvent);
    } catch (error) {
      console.error('Error deleting event:', error);

      // エラーが発生した場合、キャッシュを元に戻す
      mutate(memberUidKey, calendarEventsData, false);
    };
  }

  async function submitShiftData(newCalendarEvents) {
    var document = {}
    for (let i = 0; i < memberList.length; i++) {
      const username = memberList[i];
      const uid = memberUidDoc[username];
      var userShiftData = { "start": {}, "end": {} };
      newCalendarEvents.map((value, index) => {
        if (uid === value["uid"]) {
          const startDateStr = value["start"].split(" ")[0];
          const endDateStr = value["end"].split(" ")[0];
          const startStr = value["start"].split(" ")[1];
          const endStr = value["end"].split(" ")[1];
          if (startDateStr !== endDateStr) {
            Object.assign(userShiftData["start"], { [`${startDateStr}`]: startStr, [`${endDateStr}`]: "00:00" });
            Object.assign(userShiftData["end"], { [`${startDateStr}`]: "23:59", [`${endDateStr}`]: endStr });
          } else {
            Object.assign(userShiftData["start"], { [`${startDateStr}`]: startStr });
            Object.assign(userShiftData["end"], { [`${endDateStr}`]: endStr });
          }
          document[value["uid"]] = userShiftData;
        }
      })
      if (document[uid] == null) {
        userShiftData = { "start": { "2015-01-01": "12:00" }, "end": { "2015-01-01": "13:00" } };
        document[uid] = userShiftData;
      }
    }
    const RequestShiftListRef = doc(db, "Groups", currentGroup.groupId, "groupInfo", "RequestShiftList");
    await setDoc(RequestShiftListRef, document);
  }

  async function confirmShiftData() {
    const Data = {
      data: {
        userId: uid,
        groupId: currentGroup.groupId,
        groupName: currentGroup.groupName
      }
    };
    const data = JSON.stringify(Data)
    const Url = 'https://send-shift-gpp774oc5q-an.a.run.app';
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

  if (isCurrentGroupLoading || isLoading || isMemberUidLoading) {
    return <div></div>;
  }

  return (
    <div>
      <div>
        <div className="Modal">
          {/*--イベントの編集フォーム--*/}
          <Modal isOpen={modalIsOpenEventClick} style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}>
            <h2>シフト編集</h2>
            <div className="modal-content">
              <h4>{selectDay}</h4>
              <div className="form-group">
                <p>名前:{eventUserName}</p>
              </div>
              <div className="form-group">
                <label htmlFor="startTime">開始時刻</label>
                <input type="time" className="form-control" id="startTime" value={startTime} onChange={(e) => { setStartTime(e.target.value) }}></input>
              </div>
              <div className="form-group">
                <label htmlFor="endTime">終了時刻</label>
                <input type="time" className="form-control" id="endTime" value={endTime} onChange={(e) => { setEndTime(e.target.value) }}></input>
              </div>
            </div>
            <button onClick={deleteEvent}>シフトを削除</button>
            <button onClick={() => { setModalIsOpenEventClick(false) }}>キャンセル</button>
            <button onClick={handleSaveEvent}>保存</button>
          </Modal>
          {/*--イベントの追加フォーム--*/}
          <Modal isOpen={modalIsOpenDateClick} style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}>
            {/* イベント追加フォーム */}
            <h2>シフト編集</h2>
            <div className="modal-content">
              <h4>{selectDay}</h4>
              <div className="form-group">
                <label htmlFor="title">名前</label>
                <select value={selectedOption} onChange={(e) => { setSelectedOption(e.target.value) }}>
                  {memberList.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="startTime">開始時刻</label>
                <input type="time" className="form-control" id="startTime" onChange={(e) => { setStartTime(e.target.value) }}></input>
              </div>
              <div className="form-group">
                <label htmlFor="endTime">終了時刻</label>
                <input type="time" className="form-control" id="endTime" onChange={(e) => { setEndTime(e.target.value) }}></input>
              </div>
            </div>
            <button onClick={() => { setModalIsOpenDateClick(false) }}>キャンセル</button>
            <button onClick={handleSaveNewEvent}>追加</button>
          </Modal>
        </div>
      </div>
      <div className='fullcalendar'>
        <div>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            nowIndicator={true}
            selectable={true}
            allDaySlot={false}
            locale="ja"
            headerToolbar={{
              center: "title",
              right: 'dayGridMonth,listMonth',
              left: "prev,next",
            }}
            buttonText={{
              prev: '<',
              next: '>',
              dayGridMonth: 'カレンダー',
              listMonth: '当月のシフト一覧',
            }}

            events={calendarEventsData}
            weekends={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>
        <div className='submitArea'>
          <button className='submit' onClick={confirmShiftData}>確定</button>
        </div>

      </div>
    </div>
  );

};


