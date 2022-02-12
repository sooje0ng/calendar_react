import React, { useEffect, useState } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import Login from "./components/Login"; //로그인 => 세션
function App() {
    const [user, setUser] = useState({
        UserKey: window.sessionStorage.getItem("UserKey"),
        name: window.sessionStorage.getItem("name"),
    });

    return (
        <div className="App">
            {user.UserKey ? (
                <Calendar user={user} setUser={setUser} />
            ) : (
                <Login setUser={setUser} />
            )}
        </div>
    );
}

export default App;
