import React from 'react';
import JournalEntries from "./JournalEntries";
import {useDispatch, useSelector} from "react-redux";
import {startLogout} from "../../redux/auth.slice";
import {startNewNote} from "../../redux/notes.slice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const {name} = useSelector(state => state.auth);
  const handleLogout = ()=>{
    dispatch(startLogout());
  }
  const handleAddNew = () => {
    dispatch(startNewNote());
  }
  return (
    <aside className='journal__sidebar'>
      <div className='journal__sidebar-navbar'>
        <h3>
          <i className='far fa-user'/>
          <span> {name}</span>
        </h3>
        <button
          className='btn'
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
      <div
        className="journal__new-entry"
        onClick={handleAddNew}
      >
        <i className='far fa-calendar-plus fa-5x'/>
        <p>New entry</p>
      </div>

      <JournalEntries />
    </aside>
  );
};

export default Sidebar;
