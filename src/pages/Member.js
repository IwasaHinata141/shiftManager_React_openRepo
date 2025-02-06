import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar.js";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../firebase.js";
import Edit from "../components/Edit.js";
import Status from "../components/Status.js";
import Header from "../components/Header.js";
import { useGroup } from "../fetch/CurrentGroupFetch.js";
import { useNavigate } from "react-router-dom";


const Member = () => {
  const [user, setUser] = useState([]);
  const { currentGroup } = useGroup(user);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser.uid);
      } else {
        console.log("no user");
        navigate('/login');
      }
    });
  });



  return (
    <>
      <div>
        {currentGroup.groupName === "no data" ? (
          <Navigate to={'/firstgroupcreate'} />
        ) : (
          <div>
            <div className="headerApp">
              <Header uid={user} />
            </div>
            <div className="SidebarApp">
              <Sidebar />
            </div>
            <div>

              <div>
                <div className="mainApp">
                  <Status uid={user} />
                  <Edit uid={user} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Member;



