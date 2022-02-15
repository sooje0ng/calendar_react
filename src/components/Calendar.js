import React, { useState, useEffect } from "react";
import "../styles/Calendar.scss";
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { IoLogOut } from "react-icons/io5";
import { AiOutlinePlus, AiOutlineClose } from "react-icons/ai";

import axios from "axios";
import API_KEYS from "../config/apikeys.json";

function Calendar(props) {
    const d = new Date();

    const arDay = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const arLastDate = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const [arDate, setArDate] = useState([]);
    const [selected, setSelected] = useState({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        date: d.getDate(),
    });
    const [viewAdd, setViewAdd] = useState(null);
    const [arSchedule, setArSchedule] = useState([]);

    useEffect(() => {
        makeCal(selected);
        getMonthlySchedules();
    }, [selected.month]);

    const select = (date) => {
        const newSelected = {
            year: selected.year,
            month: selected.month,
            date: date,
        };
        setSelected(newSelected);
    };

    const makeCal = (data) => {
        const firstDay = new Date(`${data.year}-${data.month}-01`).getDay();
        const newArDate = [];
        for (let i = 0; i < firstDay; i++) {
            newArDate.push("");
        }
        for (let i = 0; i < arLastDate[data.month - 1]; i++) {
            newArDate.push(i + 1 + "");
        }
        setArDate(newArDate);
    };

    const prevMonth = () => {
        const newMonth = {
            year: selected.month === 1 ? selected.year - 1 : selected.year,
            month: selected.month === 1 ? 12 : selected.month - 1,
            date: 1,
        };

        setSelected(newMonth);
    };

    const nextMonth = () => {
        const newMonth = {
            year: selected.month === 12 ? selected.year + 1 : selected.year,
            month: selected.month === 12 ? 1 : selected.month + 1,
            date: 1,
        };

        setSelected(newMonth);
    };

    const getMonthlySchedules = async () => {
        axios({
            method: "GET",
            url: "/calendar",
            params: {
                apikey: API_KEYS.calendar,
                year: selected.year,
                month: selected.month,
                userkey: props.user.UserKey,
            },
        }).then((res) => {
            console.log(res.data);
            setArSchedule(res.data.result);
        });
    };

    const getDailySchedules = async () => {
        axios({
            method: "GET",
            url: "/calendar",
            params: {
                apikey: API_KEYS.calendar,
                year: selected.year,
                month: selected.month,
                date: selected.date,
                userkey: props.user.UserKey,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const addSchedule = async () => {
        let date =
            selected.year +
            "-" +
            String(selected.month).padStart(2, "0") +
            "-" +
            String(selected.date).padStart(2, "0");

        let startTime = document.getElementById("startTime");
        let endTime = document.getElementById("endTime");
        let title = document.getElementById("title");
        let memo = document.getElementById("memo");
        let allday = document.getElementById("allday");

        if (!startTime.value) {
            alert("시작 시간을 입력해주세요.");
            return;
        } else if (!endTime.value) {
            alert("종료 시간을 입력해주세요.");
            return;
        } else if (!title.value) {
            alert("일정 제목을 입력해주세요.");
            return;
        }
        axios({
            method: "POST",
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar, //mandatory
                StartDateTime: date + "T" + startTime.value, //mandatory
                EndDateTime: date + "T" + endTime.value, //mandatory
                UserKey: props.user.UserKey, //mandatory
                Title: title.value, //mandatory
                Memo: memo.value, //optional
                AllDay: allday.checked, //optional
            },
        }).then((res) => {
            getMonthlySchedules();
            setViewAdd(null);
            startTime.value = "";
            endTime.value = "";
            startTime.readOnly = false;
            endTime.readOnly = false;
            title.value = "";
            memo.value = "";
            allday.checked = "";
        });
    };

    const editSchedule = async () => {
        axios({
            method: "PUT",
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar,
                id: "61fe81e6328a63873c1e0bb4",
                UserKey: 3,
                StartDateTime: "2022-02-10T21:30",
                EndDateTime: "2022-02-10T23:30",
                Title: "스터디하는 날 ㅎㅎ",
                Memo: "미뤄짐 ㅠ",
                AllDay: false,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const removeSchedule = async () => {
        axios({
            method: "DELETE",
            url: "/calendar",
            data: {
                apikey: API_KEYS.calendar,
                id: "6202702bb7f1163179d98c60",
                UserKey: 3,
            },
        }).then((res) => {
            console.log(res.data);
        });
    };

    const logout = () => {
        //App.js에 있는 state(user)을 없애야!(UserKey:null, name: null)
        //sessionStorage에 있는 UserKey, name 없애기
        props.setUser({
            UserKey: null,
            name: null,
        });
        window.sessionStorage.removeItem("UserKey");
        window.sessionStorage.removeItem("name");
    };

    const allDay = (e) => {
        const startTime = document.getElementById("startTime");
        const endTime = document.getElementById("endTime");
        if (e.target.checked) {
            startTime.value = "00:00";
            endTime.value = "23:59";
            startTime.readOnly = true;
            endTime.readOnly = true;
        } else {
            startTime.readOnly = false;
            endTime.readOnly = false;
        }
    };
    return (
        <div className="Calendar">
            <header>
                <AiFillCaretLeft size={30} color="white" onClick={prevMonth} />
                <div>
                    <p className="year">{selected.year}</p>
                    <p className="month">{selected.month}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <AiOutlinePlus
                        size={30}
                        color="white"
                        onClick={() => setViewAdd("Add")}
                    />
                    <IoLogOut size={30} color="white" onClick={logout} />
                    <AiFillCaretRight
                        size={30}
                        color="white"
                        onClick={nextMonth}
                    />
                </div>
            </header>
            <div className="content">
                <ul className="arDay">
                    {arDay.map((value, index) => (
                        <li key={index} className="day">
                            {value}
                        </li>
                    ))}
                </ul>
                <ul className="arDate">
                    {arDate.map((date, index) => (
                        <li
                            key={index}
                            className="date"
                            onClick={() => select(date)}
                        >
                            <span
                                className={date == selected.date ? "today" : ""}
                            >
                                {date}
                            </span>
                            <ul className="schedules">
                                {arSchedule.map((schedule, scheIndex) =>
                                    parseInt(
                                        schedule.StartDateTime.substr(8, 2)
                                    ) == date ? (
                                        <li
                                            key={scheIndex}
                                            onClick={() => setViewAdd("Detail")}
                                        >
                                            {schedule.Title}
                                        </li>
                                    ) : null
                                )}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
            <div
                className="addSchedule"
                style={viewAdd ? {} : { display: "none" }}
            >
                <div className="addScheduleForm">
                    <AiOutlineClose
                        className="btn-close"
                        size={20}
                        onClick={() => setViewAdd(null)}
                    />
                    <h2>
                        일정{" "}
                        {viewAdd === "Add"
                            ? "추가"
                            : viewAdd === "Edit"
                            ? "수정"
                            : ""}
                    </h2>
                    {viewAdd === "Add" ? (
                        <div>
                            <p>
                                {selected.year}년 {selected.month}월{" "}
                                {selected.date}일{" "}
                            </p>
                            <input type="time" id="startTime" />
                            <input type="time" id="endTime" />

                            <label>
                                <input
                                    id="allday"
                                    type="checkbox"
                                    onChange={allDay}
                                />
                                하루종일
                            </label>
                            <input
                                id="title"
                                type="text"
                                placeholder="일정 제목"
                            />
                            <input
                                id="memo"
                                type="text"
                                placeholder="일정 내용"
                            />
                            <button onClick={addSchedule}>일정 추가</button>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default Calendar;
