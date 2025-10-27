import React, { useEffect, useState, useMemo } from 'react'
import "../Styles/DisplaySend.css"
import status1 from "../images/IMG_20250502_114538.jpg"
import send from "../images/paper-plane.png"
import close from "../images/ad6f8ce5-b6ba-4bde-b4af-a6d0b3db434c.png"
import { initializeApp } from 'firebase/app'
import playBtn  from "../images/play-1073616_640.png"
import imagePreview from "../images/photo (1).png"
import { getAnalytics } from "firebase/analytics";
import {getDatabase,ref,push,set,get, query, onValue, orderByChild, equalTo, orderByKey,update,startAt,endAt} from "firebase/database"
import MediaTypesSelect from './MediaTypesSelect'

const ChatMediaSend = (props) => {
    console.log(props);
    
    const [caption, setCaption] = useState("")
    const [mutualFriends, setMutualFriends] = useState([])
    const [userPrompt, setUserPrompt] = useState("")
    const [mediaType, setMediaType] = useState("")
    const [mediaData, setMediaData] = useState("")
    const closeSend = () =>{
        props.setDisplayMedia(()=>false)
    }
    useEffect(() => {
        setMediaData(()=>props.displayUrl)
        setMediaType(()=>props.mediaType)
    }, [])
    let userName 
    useEffect(() => {
        const localData = JSON.parse(localStorage.getItem("TilChat"))
        userName = localData.UserName
    }, [])
    const MediaSelect = useMemo(() => {
        return <MediaTypesSelect type={props.mediaType} data={props.displayUrl}/>
    }, [props.mediaType, props.displayUrl])
    return (
        <div className='sendOverall'>
            <div className="previewBox">
                {MediaSelect}
            </div>
            <div className="caption">
                <div className="shrink">
                    <input type="text"  placeholder='write a caption' value={userPrompt} onChange={(e)=>{props.setUserPrompt(e.target.value)}}/>
                    <img src={send} onClick={props.sendMediaChat}/>   
                </div>
            </div>
            <img src={close} alt="" className="close" onClick={closeSend}/>
        </div>
    )
}

export default ChatMediaSend