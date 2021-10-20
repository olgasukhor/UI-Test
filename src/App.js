import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter } from "react-router-dom";
import ModalBtn from './components/ModalBtn';
import NavTabs from './components/NavTabs';
import Context from './components/context';
import Router from './components/Router';
import headCells from './components/headCells';


function App() {

  const [profiles, setProfiles] = useState([])
  const [headCheck, setHeadCheck] = useState(headCells)
  const [row, setRow] = useState([]);

  useEffect(() => {
    const getProfiles = async () => {
      let profilesFromServer = await fetchProfiles()
      setProfiles(profilesFromServer)
    }
    getProfiles()
  }, [])

  const fetchProfiles = async () => {
    const res = await fetch('http://localhost:5000/profiles')
    const data = await res.json()
    return (data)
  }

  const fetchProfile = async (id) => {
    const res = await fetch('http://localhost:5000/profiles/' + id)
    const data = await res.json()
    return (data)
  }


  // const RowfromLS = () => {
  // const rowLS = localStorage.getItem('columns' || [])
  // setRow(JSON.parse(rowLS))
  // }
  useEffect(() => {
    const row = localStorage.getItem('columns' || [])
    setRow(JSON.parse(row))
  }, [])

  let checkedHeadCell = []
  const headChecked = () => {
    for (let i = 0; i < headCells.length; i++) {
      for (let k = 0; k < row.length; k++) {
        if (headCells[i].id === row[k]) {
          checkedHeadCell.push(headCells[i])
        }
      }
    }
    checkedHeadCell = Array.from(new Set(checkedHeadCell));
    setHeadCheck(checkedHeadCell)
  }

  let profilesNew = [];
  function checkedColumnsNew() {

    let element = [];
    for (let i = 0; i < row.length; i++) {
      element.push(row[i])
    }
    let checkedColumns = element.join(', ');

    for (let i = 0; i < profiles.length; i++) {
      const element = profiles[i];
      const keys = Object.keys(element).filter(key => checkedColumns.includes(key));
      const sortedObj = Object.fromEntries(
        keys.map(key => [key, element[key]])
      );
      console.log(sortedObj)
      profilesNew.push(sortedObj)
    }
    setProfiles(profilesNew)
  }
  console.log(profilesNew)
  console.log(profiles)

  return (
    <Context.Provider value={{ profiles, setProfiles, fetchProfile, headCheck, setHeadCheck, row, setRow, headChecked, checkedColumnsNew }}>
      <BrowserRouter>
        <div className="App">
          <NavTabs />
          <ModalBtn />
          <Router />
        </div>
      </BrowserRouter>
    </Context.Provider>

  );
}

export default App;
