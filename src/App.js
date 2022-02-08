import React, { useState } from "react";
import "./App.css";
import Calendar from "./components/Calendar";
import Login from "./components/Login"; //로그인 => 세션
function App() {
    const [user, setUser] = useState({ UserKey: null, name: null });
    return (
        <div className="App">
            {/*user.UserKey ? (
                <Calendar user={user} />
            ) : (
                <Login setUser={setUser} />
            )*/}
            <Calendar />
        </div>
    );
}

export default App;
