import React from 'react'
import { SidebarData } from "./SidebarData";
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import { signOut } from "firebase/auth"
import { auth } from "../firebase.js";
import { useNavigate } from "react-router-dom";




const Sidebar = () => {
  
  const navigate = useNavigate();
  const logout = async () => {
    await signOut(auth);
    navigate("/login/");
  }

  return (
    <div className='Sidebar'>
      <ul className='SidebarList'>
        {SidebarData.map((value, key) => {
          return (
            <li key={key} id={window.location.pathname === value.link ? "active" : ""} className='row' onClick={() => { window.location.pathname = value.link; }}>
              <div id='icon'>{value.icon}</div>
              <div id='title'>{value.title}</div>
            </li>
          );
        })}
        

        <li key="setting" id={window.location.pathname === "/login" ? "active" : ""} className='setting' onClick={() => { window.location.pathname = "/setting"; }}>
          <div id='icon'>{<SettingsIcon />}</div>
          <div id='title'>マイアカウント</div>
        </li>
        <li key="logout" id={window.location.pathname === "/login" ? "active" : ""} className='logout' onClick={() => logout()}>
          <div id='icon'>{<LogoutIcon />}</div>
          <div id='title'>ログアウト</div>
        </li>
      </ul>
    </div>
  )
}

export default Sidebar