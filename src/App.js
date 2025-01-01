import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";
import Member from "./pages/Member";
import Shift from "./pages/Shift"
import CreateGroup from "./pages/CreateGroup";
import Setting from "./pages/Setting"
import FirstGroupCreate from "./pages/FirstGroupCreate";



const App = () => {
  

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path={`/register/`} element={<Register />} />
          <Route path={`/login/`} element={<Login />} />
          <Route path={`/`} element={<Member />} />
          <Route path={`/shift`} element={<Shift />} />
          <Route path={`/creategroup`} element={<CreateGroup />} />
          <Route path={`/setting`} element={<Setting />} />
          <Route path={'/firstgroupcreate'} element={<FirstGroupCreate />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;