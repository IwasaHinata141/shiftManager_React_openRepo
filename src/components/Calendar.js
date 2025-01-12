import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import Modal from 'react-modal';
import { useState, useEffect } from "react";
import { doc, setDoc } from 'firebase/firestore';
import { db } from "../firebase.js";


Modal.setAppElement('#root');



export const Calendar = (props) => {
  const [modalIsOpenEventClick, setModalIsOpenEventClick] = useState(false);
  const [modalIsOpenDateClick, setModalIsOpenDateClick] = useState(false);
  const [selectDay, setSelectedDay] = useState();
  const [options, setOptions] = useState(
    props.memberList
  );
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [eventUserName, setEventUserName] = useState("");
  const [eventId, setEventId] = useState();
  const [eventCount, setEventCount] = useState();



  useEffect(() => {
    let idCount = 0;
    const EventList = [];
    for (let i = 0; i < props.memberList.length; i++) {
      const username = props.memberList[i];
      const uid = props.memberUidDoc[username];
      const shiftData = props.shiftList[uid];
      if (shiftData !=null) {
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
    setCalendarEvents(EventList);
    setEventCount(EventList.length);
  }, []);



  const handleDateClick = (e) => {
    setSelectedDay(e.dateStr);
    setSelectedOption(options[0])
    setModalIsOpenDateClick(true);
    console.log(calendarEvents);
  }
  const handleEventClick = (arg) => {
    console.log(arg.event);
    const dateStr = arg.event.startStr.split("T")[0];
    console.log(dateStr);
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
  const handleSaveEvent = () => {
    // イベントデータをサーバーに送信する処理
    setModalIsOpenEventClick(false);
    setModalIsOpenDateClick(false);
    const start = new Date(`${selectDay}T${startTime}:00.000+09:00`);
    const end = new Date(`${selectDay}T${endTime}:00.000+09:00`);
    const uid = props.memberUidDoc[eventUserName];
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
    setCalendarEvents(calendarEvents.map((value, index) => (index === Number(eventId) ? newCalendarEventInstance : value)));

  };

  /*--新しいイベントの追加--*/
  const handleSaveNewEvent = () => {
    const start = new Date(`${selectDay}T${startTime}:00.000+09:00`);
    const end = new Date(`${selectDay}T${endTime}:00.000+09:00`);
    const uid = props.memberUidDoc[selectedOption];
    var newCalendarEventInstance = {};
    setModalIsOpenDateClick(false);
    if (end > start) {
      newCalendarEventInstance = {
        id: eventCount,
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
        id: eventCount,
        title: `${selectedOption}`,
        start: `${selectDay} ${startTime}`,
        end: `${nextDay} ${endTime}`,
        backgroundColor: '#2093df',
        editable: true,
        uid: `${uid}`
      };
    }
    setEventCount(calendarEvents.length + 1);
    setCalendarEvents([...calendarEvents, newCalendarEventInstance]);
  };

  const deleteEvent = () => {
    setModalIsOpenEventClick(false)
    var newCalenderEvents = [];
    var checker = false;
    calendarEvents.map((value, index) => {
      if (index !== Number(eventId) && checker === false) {
        newCalenderEvents.push(value);
      } else if (index !== Number(eventId) && checker === true) {
        value["id"] = index - 1;
        newCalenderEvents.push(value);
      } else if (index === Number(eventId)) {
        checker = true;
      }
    });
    setCalendarEvents(newCalenderEvents);
  }

  async function submitShiftData() {
    var document = {}
    for (let i = 0; i < props.memberList.length; i++) {
      const username = props.memberList[i];
      const uid = props.memberUidDoc[username];
      var userShiftData = { "start": {}, "end": {} };
      console.log(calendarEvents);
      calendarEvents.map((value, index) => {
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
    }
    console.log(document);
    const RequestShiftListRef = doc(db, "Groups", props.groupId, "groupInfo", "RequestShiftList");
    await setDoc(RequestShiftListRef, document);
  }

  async function confirmShiftData() {
    const Data = {
      data: {
        userId: props.user.uid,
        groupId: props.groupId,
        groupName: props.groupName
      }
    };
    const data = JSON.stringify(Data)
    console.log(data);
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
                  {options.map((option, index) => (
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
            <button onClick={handleSaveNewEvent}>保存</button>
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

            events={calendarEvents}
            weekends={true}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
          />
        </div>
        <div className='submitArea'>
          <button className='submit' onClick={submitShiftData}>一時保存</button>
          <button className='submit' onClick={confirmShiftData}>確定</button>
        </div>

      </div>
    </div>
  );

};


