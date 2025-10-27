import React, { useState,useEffect, useRef, useMemo, useCallback } from 'react'
import "../Styles/AIChat.css"
import send from "../images/paper-plane.png"
import profileArrow from "../images/left-arrow-white.png"
import ai from "../images/bot.png"
import deleteImg from "../images/delete.png"
import linkBtn from "../images/link.png"
import gallery from "../images/picture.png"
import imagePreview from "../images/photo (1).png"
import videoPreview from "../images/video.png"
import cameraIcon from "../images/camera.png"
import playBtn  from "../images/play-1073616_640.png"
import documentIcon from "../images/documentation.png"
import contactIcon from "../images/mobile.png"
import locationIcon from "../images/location (1).png"
import videoNoteIcon from "../images/clapperboard.png"
import pollIcon from "../images/poll.png"
import meetingIcon from "../images/discussion.png"
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import {getDatabase,ref,push,set,get, query, onValue, orderByChild, equalTo, orderByKey, update} from "firebase/database"
import { useNavigate } from 'react-router-dom'
import ChatMediaSend from './ChatMediaSend'
import VideoPlayer from './VideoPlayer'
import PreviewMedia from './PreviewMedia'
import MediaTypesSelect from './MediaTypesSelect'



const firebaseConfig = {
  apiKey: "AIzaSyCoDIlOAkemogzj-Gw2G_lVO7VI7uEeIG8",
  authDomain: "tilchat-91043.firebaseapp.com",
  databaseURL: "https://tilchat-91043-default-rtdb.firebaseio.com",
  projectId: "tilchat-91043",
  storageBucket: "tilchat-91043.firebasestorage.app",
  messagingSenderId: "293755713788",
  appId: "1:293755713788:web:a28845400f6f8992a87f79",
  measurementId: "G-CP47MXQ3MG"
};

const appSettings = {
    databaseURL: "https://tilchat-91043-default-rtdb.firebaseio.com/"
}



const app = initializeApp(firebaseConfig);
const db = getDatabase(app)
const analytics = getAnalytics(app);



const ChatDisplay = (props) => {
    const navigate = () =>{useNavigate()}
    const useVal = ()=>{val()}
    const userNameGet = localStorage.getItem("TilChat")
    const [userName, setUserName] = useState()
    const [mediaOption, setMediaOption] = useState(false)
    const [displayUrl, setDisplayUrl] = useState()
    const [displayMedia, setDisplayMedia] = useState(false)
    const [mediaType, setMediaType] = useState()
    const [previewMedia, setPreviewMedia] = useState(false)
    const previewSrc = useRef(null)
    const previewType = useRef(null)
    const userPrompt = useRef("")

    const preview = (data, type) =>{
        previewSrc.current = data
        previewType.current = type
        setPreviewMedia(()=>true)
    }
    useEffect(() => {
        if(!userNameGet){
            navigate("/signup")
        }
        else{
            setUserName(JSON.parse(userNameGet).UserName)
        }
    }, [navigate])
    const [chatArray, setChatArray] = useState([])
    const propsValue = useRef()

    const saveChat = async(directory, data) =>{
        const cache = await caches.open('TilCache')
        const response = new Response(JSON.stringify(data))
        await cache.put(directory, response)
    }

    const getChat = async(key)=>{
        const cache = await caches.open("TilCache")
        const response = await cache.match(key)
        return response? await response.json() : null
    }
    const previousChat = useRef()

    useEffect(() => {
        console.log("chat Info", props.chatInfo)
        getChat(props.chatInfo)
        .then((output)=>{
            console.log(output)
            if (output) {
                setChatArray(()=>output)
            }
            else{
                setChatArray(()=>[])
            }
        })
        .catch((error)=>{
            console.log(error);
        })
    }, [props.chatInfo])
    const checkUser = useRef()
    useEffect(() => {
        propsValue.current = props.chatInfo
        const requestValue = onValue(ref(db,"Messages/"+props.chatInfo+"/"),(output)=>{
            if (props.chatInfo == propsValue.current) {
                if (output.val()?.chatArray) {
                    if (output.val().chatArray != "No message") {
                        if (output.val()?.message != "hello") {
                            const userName = JSON.parse(localStorage.getItem("TilChat")).UserName
                            if(Object.keys(output.val().chatArray[0])[0] != userName){
                                console.log(output.val().chatArray);
                                
                                set(ref(db,"Messages/"+props.chatInfo),{
                                    chatArray: "No message"
                                })
                                setChatArray(prev=>[...prev, ...output.val().chatArray])
                            }
                            
                        }
                    }
                }
            }
            // saveChat(props.chatInfo, chatArray)
        })
        return requestValue
    }, [props.chatInfo])
    const sendChat = () =>{
        const message = userPrompt.current.value
        if(message){
            get(ref(db, "Messages/"+props.chatInfo))
            .then((output)=>{
                console.log("Username",userName);
                if(!output.val().chatArray || output.val().chatArray == "No message" || typeof(output.val().message) == "string"){
                    setChatArray(prev=>[...prev, {[userName]:{
                            prompt:message,
                            media: null,
                            mediaType: null,
                            mediaLink: null
                        }}])
                    set(ref(db,"Messages/"+props.chatInfo),{
                        chatArray: [{[userName]:{
                            prompt:message,
                            media: null,
                            mediaType: null,
                            mediaLink: null
                        }}]
                    })
                    .then(()=>{
                        userPrompt.current.value = ""
                        setMediaOption(()=>true)
                        setMediaOption(()=>false)
                    })
                }
                else{
                        let tempData = output.val().chatArray
                        console.log(tempData);
                        setChatArray(prev=>[...prev, {[userName]:{
                            prompt:userPrompt.current.value
                        }}])
                        set(ref(db,"Messages/"+props.chatInfo),{
                            chatArray: tempData
                        })
                        .then(()=>{
                            userPrompt.current.value = ""
                            setMediaOption(()=>true)
                            setMediaOption(()=>false)
                        })
                    }
                saveChat(props.chatInfo, chatArray)
                getChat(props.chatInfo)
            })
        }
    }
    const sendMediaChat = useCallback(() =>{
        const message = userPrompt.current.value
        console.log();
        
        get(ref(db, "Messages/"+props.chatInfo))
        .then((output)=>{
            console.log("Username",userName);
            const randoms = "-_--_abcdefghijklmnA1234567890ABCDEFGHIJKLMNO-__-"
            let randomValue = ""
            for (let index = 0; index < 12; index++) {
                const generateRandom = randoms[Math.floor(Math.random()*randoms.length)]
                randomValue = randomValue + generateRandom
            }
            let dataParticlesCollection = []
            let dataParticleSize = 15000
            console.log(displayUrl);
            for (let index = 0; index < displayUrl.length; index += dataParticleSize) {
                const particles  = displayUrl.slice(index, index + dataParticleSize)
                dataParticlesCollection.push(particles)
            }
            if(!output.val().chatArray || output.val().chatArray == "No message" || typeof(output.val().message) == "string"){
                // const blob = new Blob([displayUrl], { type: mediaType });
                // const url = URL.createObjectURL(blob);
                console.log(message);
                
                setChatArray(prev=>[...prev, {[userName]:{
                        prompt: message,
                        media: displayUrl,
                        mediaType: mediaType
                }}])
                const randoms = "abcdefghijklmnA1234567890BCDOELQPMLS"
                const generateRandom = randoms[Math.floor(Math.random()*randoms.length)]
                console.log(generateRandom);
                
                for (let index = 0; index < dataParticlesCollection.length; index++) {
                    set(ref(db, `Media/${randomValue}/${[index]}`),{
                        data : dataParticlesCollection[index]
                    })
                }
                set(ref(db,"Messages/"+props.chatInfo),{
                    chatArray: [{[userName]:{
                        prompt:message,
                        mediaLink: randomValue,
                        mediaType: mediaType
                    }}]
                })
                .then(()=>{
                    userPrompt.current.value = ""
                    setMediaOption(()=>false)
                    setDisplayMedia(()=>false)
                })
            }
            else{
                console.log(message);
                
                let tempData = output.val().chatArray
                const blob = new Blob([displayUrl], { type: mediaType });
                const url = URL.createObjectURL(blob);
                setChatArray(prev=> [...prev, {[userName]:{
                    prompt:message,
                    media: displayUrl,
                    mediaType: mediaType
                }}])
                for (let index = 0; index < dataParticlesCollection.length; index++) {
                    set(ref(db, `Media/${randomValue}/${[index]}`),{
                        data : dataParticlesCollection[index]
                    })
                }
                // alert("start")
                tempData.push({[userName]:{
                    prompt:message,
                    mediaLink: randomValue,
                    mediaType: mediaType
                }})
                console.log(tempData);
                set(ref(db,"Messages/"+props.chatInfo),{
                    chatArray: tempData
                })
                .then(()=>{
                    userPrompt.current.value = ""
                    setMediaOption(()=>false)
                    setDisplayMedia(()=>false)
                })
            }
        })
    }, [userPrompt])
    const changeMediaOption = () =>{
        if (mediaOption) {
            setMediaOption(()=>false)
        }
        else{
            setMediaOption(()=>true)
        }
    }
    const displayGallery = (e) =>{
        const file = e.target.files[0]
        let reader = new FileReader
        reader.addEventListener("load", (e)=>{
            const bufferResult = e.target.result
            const uint8Array = new Uint8Array(bufferResult)
            // const blob = new Blob([uint8Array], { type: file.type });
            // const url = URL.createObjectURL(blob);
            setDisplayUrl(()=>uint8Array)
            if (file.type == "image/png" || file.type == "image/jpg" || file.type == "image/jpeg") {
                setMediaType(()=>"image")
                setDisplayMedia(()=>true)
            }
            else if (file.type == "video/mp4") {
                setMediaType(()=>"video")
                setDisplayMedia(()=>true)
            }
            else{
                alert("Invalid media type")
            }
        })
        reader.readAsArrayBuffer(file)
    }
    useEffect(() => {
        const fetchMedia = async() =>{
            const arrayToMap = chatArray
            let arrayToAdjust = chatArray
            for (let index = 0; index < arrayToMap.length; index++) {
                const output = arrayToMap[index]
                const user = Object.keys(output)[0]
                console.log(user, userName);
                console.log(chatArray);
                const userData = output[user]
                if(user != userName && userData?.mediaLink && !userData?.media){
                    get(ref(db, `Media/${userData.mediaLink}`))
                    .then((response)=>{
                        const allChunks = response.val()
                        let collectData = []
                        console.log(allChunks);
                        
                        allChunks.map((output, index) => {
                            collectData.push(output.data)
                        })
                        console.log("ollectData",collectData);
                        console.log("media",arrayToAdjust[index][user].mediaType);
                        const uint8Chunks = collectData.map(chunk => new Uint8Array(chunk));
                        const blob = new Blob(uint8Chunks, { type: arrayToAdjust[index][user].mediaType });
                        const url = URL.createObjectURL(blob);
                        arrayToAdjust[index][user].media = url
                        setChatArray(()=>arrayToAdjust)
                        allChunks.map((output, index)=>{
                            set(ref(db, `Media/${userData.mediaLink}/${index}`), null)
                            .then(()=>{
                                console.log(`Deleted ${userData.mediaLink}/${index}`);
                            })
                        })
                    })
                }
                setChatArray(()=>arrayToAdjust)
            }
            setChatArray(()=>arrayToAdjust)
            
        }
        fetchMedia()
    }, [chatArray])
    const MemorizedMediaType = React.memo(MediaTypesSelect)
    return (
        <>
            {displayMedia?
                <ChatMediaSend displayUrl={displayUrl} setDisplayMedia={setDisplayMedia} mediaType={mediaType} sendMediaChat={sendMediaChat}/>:
                <div className='view-overall'>
                {previewMedia? <PreviewMedia previewSrc = {previewSrc.current} previewType = {previewType.current} setPreviewMedia={setPreviewMedia}/> : null}
                <header>    
                    <div className="profile">
                        <img src={profileArrow} className='navigateArrow'/>
                        <img src={props.chatFriendDetail.profilePic} alt="" style={{filter: "invert(0) opacity(.8)",border: "2px solidrgb(0, 4, 222)"}}/>
                        <div style={{display:"flex",flexDirection:"column"}}>
                            <p>{props.chatFriendDetail.FullName}</p>
                            <small style={{color:'whitesmoke'}}>@{props.chatFriendDetail.UserName}</small>
                        </div>
                    </div>
                    <div className="settings">
                        <img src={deleteImg} alt="" title='delete'/>
                    </div>
                </header>
                <div className='welcome-view-ai'>
                    <div className='chat-log-overflow'>
                        <div className="chat-log">
                            {
                                chatArray.map((output,index)=>{
                                    if(output){
                                        if (Object.keys(output)[0] == userName) {
                                            return(
                                                <div className='request chat-request' key={index}>
                                                    <main>
                                                    <MediaTypesSelect type={output[`${userName}`].mediaType} data={output[`${userName}`].media}/>
                                                        <p>{output[`${userName}`].prompt}</p>
                                                    </main>
                                                </div>
                                            )
                                        }
                                        else{
                                            return(
                                                <div className='response chat-response' key={index}>
                                                    <main>
                                                    <MediaTypesSelect type={output[`${Object.keys(output)[0]}`].mediaType} data={output[`${Object.keys(output)[0]}`].media}/>
                                                    <p>{output[`${Object.keys(output)[0]}`].prompt}</p>
                                                    </main>
                                                </div>
                                            )
                                        }
                                    }
                                })
                            }
                        </div>
                    </div>
                </div>
                {
                    mediaOption?
                    <div className="mediaType">
                        <input type="file" id='galleryUpload' onChange={(e)=>{displayGallery(e)}} name='galleryUpload' style={{display:"none"}}/>
                        <div>
                            <label htmlFor="galleryUpload">
                                <img src={gallery} alt="" />
                                <p>Photos & Videos</p>
                            </label>
                        </div>
                        <div>
                            <img src={documentIcon} alt="" />
                            <p>Document</p>
                        </div>
                        <div>
                            <img src={contactIcon} alt="" />
                            <p>Contact</p>
                        </div>
                        <div>
                            <img src={locationIcon} alt="" />
                            <p>Location</p>
                        </div>
                        <div>
                            <img src={videoNoteIcon} alt="" />
                            <p>Video Note</p>
                        </div>
                        <div>
                            <img src={pollIcon} alt="" />
                            <p>Poll</p>
                        </div>
                        <div>
                            <img src={meetingIcon} alt="" />
                            <p>Meeting</p>
                        </div>
                    </div>:
                    null
                }
                <div className="welcome-input">
                    <input type="text" ref={userPrompt}/>
                    <img src={linkBtn} alt="" onClick={changeMediaOption}  className='addBtn'/>
                    <img src={send} onClick={sendChat} alt=""/>
                </div>
            </div>
            }
        </>
    )
}

export default ChatDisplay
