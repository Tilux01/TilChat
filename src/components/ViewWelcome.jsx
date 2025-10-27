import React, { useEffect, useState } from 'react'
import profileArrow from "../images/left-arrow-white.png"
import profileImg from "../images/IMG-20250502-WA0019 (1).jpg"
import archive from "../images/archive.png"
import deleteImg from "../images/delete.png"
import welcome from "../images/motion-sensor.png"
import send from "../images/paper-plane.png"
import "../Styles/viewWelcome.css"

const ViewWelcome = (props) => {
    const [userCredentials, setUserCredentials] = useState([])
    const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
    const changePage = () => {
        props.setViewState("ChatBot")
    }

    return (
        <div className='view-overall'>
            <header>
                <div className="profile">
                    <img src={profileArrow} alt="" className='navigateArrow'/>
                    <img src={profileImg} alt="" />
                    <p>{userNameLoc.UserName}</p>
                </div>
            </header>
            <div className="welcome-view">
                <img src={welcome} alt="" />
                <p>Welcome, Explore</p>
            </div>
            <div className="welcome-input">
                <input type="text" placeholder='Chat With AI' onClick={changePage}/>
                <img src={send} alt="" />
            </div>
        </div>
    )
}

export default ViewWelcome
