import React, { useContext, useState, useRef, useEffect } from 'react'
import profileArrow from "../images/left-arrow-white.png"
import profileImg from "../images/IMG-20250502-WA0019 (1).jpg"
import archive from "../images/archive.png"
import deleteImg from "../images/delete.png"
import ai from "../images/bot.png"
import send from "../images/paper-plane.png"
import "../Styles/AIChat.css"
import { ViewStateContext } from '../App'
import axios from 'axios'
import { GoogleGenAI } from "https://esm.run/@google/genai";

const WelcomeComponent = ()=>{
    return(
        <>
            <img src={ai} alt="" />
            <p>Start&nbsp;Typing....</p>
        </>
    )
}

const ChatComponent = (props) =>{
    return(
        <>
            <div className='chat-log-overflow'>
                <div className="chat-log">
                    {
                        props.chatArray.map((output,index)=>(
                            <div className={output.className} key={index}>
                                <main>
                                <p>{output.Text}</p>
                                </main>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>
    )
}

const AIComponent = () => {

    const [chatArray, setChatArray] = useState([])
    const [Section, setSection] = useState(true)
    const [userPrompt, setUserPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const currentKeyIndex = useRef(0)
    const apiKeys = useRef(["AIzaSyCEJago6IMwgYyyc613BlAL8zQIUg2RHv8",
        "AIzaSyDqxLHV2mpeWEMNM-1qQjGGGUeWJuGYrgU",
        "AIzaSyBr4JTEnGvyi_ckOQJilC9JPESiMIkoe58",
        "AIzaSyCp1t-gGrmEjZvcrm1e5cHJ6EZfDrivn_M",
        "AIzaSyCvW48e-B_bINFNRc-t19LJ5bu5A5ZTIeM",
        "AIzaSyC-YVAtvUL5eFU0dTQ8q9a6EC15Qvg1cKw",
        "AIzaSyA-WFgoIf6Vh9TUnJMMSLXx43325Dcl-Aw",
        "AIzaSyCMIgj2ohoHb7MSuLbi_yvObxvX70R35NQ",
        "AIzaSyA7HSWLU4vSLpD8bbiLwmLawCnjvbIPPzw",
        "AIzaSyDZWpd2okJW83f8YTmJWVghrhoviY4rq_w",
        "AIzaSyD9EWf0vKzZoWNPtwHXg5v1IPOsEfVo3DY",
        "AIzaSyBHb9C8jZAu8xPiESDusSE9blx_PgFYnFM",
        "AIzaSyCzEVCT52ZGXxfXWJNaWthl2VlQ1f8arQo",
        "AIzaSyAwvdRH8Qv72UU3lbA8HYeBOWRQ3fTltVE"])

    const query = async() =>{
        const ai = new GoogleGenAI({
            apiKey: apiKeys.current[currentKeyIndex.current]
        });
        
        setIsLoading(true);
        try {
            const result = await ai.models.generateContent({
                model: "gemini-2.0-flash-lite",
                contents: userPrompt
            });
            console.log(result);
            
            setChatArray(C=>[...C,{Text:result.text,className:"response"}])
            console.log(...chatArray);
            setUserPrompt("")
        }
        catch (error){
            if(currentKeyIndex.current >= apiKeys.current.length-1){
                setChatArray(C=>[...C,{Text:"Server Error, pls try again later",className:"response"}])
                console.log(...chatArray);
                setUserPrompt("")
            }
            else{
                console.error("Gemini Error:", error);
                currentKeyIndex.current = currentKeyIndex.current + 1
                console.log(currentKeyIndex.current);
                query()
            }
        } 
        finally {
            setIsLoading(false);
        }
    }

    const sendQuery = () =>{
        const isOnline = (window.clientInformation.onLine);
        if(isOnline == true){
            if (userPrompt.length > 0) {
                currentKeyIndex.current = 0
                setSection(false)
                setChatArray(C=>[...C,{Text:userPrompt,className:"request"}])
                query()
                console.log("done");
                }
        }
        else{
            alert("Pls connect to internet")
        }
        
    }
    


    // useEffect(() => {
    //     document.addEventListener("keydown", (e)=>{
    //         if (e.key == "Enter") {
    //             sendQuery()
    //         }
    //     })
    // }, [])
    
    return (
    <div className='view-overall'>
            <header>
                <div className="profile">
                    <img src={profileArrow} alt="" />
                    <img src={ai} alt="" style={{filter: "invert(1) opacity(.8)",border: "2px solid #DE8900"}}/>
                    <p>ChatBot</p>
                </div>
                <div className="settings">
                    <img src={deleteImg} alt="" title='delete'/>
                </div>
            </header>
            <div className="welcome-view-ai">
            {Section?<WelcomeComponent/>:<ChatComponent chatArray={chatArray}/>}
            </div>
            <div className="welcome-input">
                <input type="text" placeholder='Type Something....' value={userPrompt} onChange={(e)=>{setUserPrompt(e.target.value)}} autoFocus/>
                <img src={send} onClick={sendQuery} alt="" disabled={isLoading}/>
            </div>
    </div>
  )
}

export default AIComponent
