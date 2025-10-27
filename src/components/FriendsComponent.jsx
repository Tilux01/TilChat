import React, { useState, useEffect, useRef } from "react";
import "../Styles/friendsComponent.css"
import profileImg from "../images/IMG-20250502-WA0019 (1).jpg"
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import {getDatabase,ref,push,set,get, query, onValue, orderByChild, equalTo, orderByKey,update,startAt,endAt} from "firebase/database"
import { useNavigate } from 'react-router-dom'
import Loader from "./Loader";

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


const FriendsComponent = (props) => {
    const [userCredentials, setUserCredentials] = useState([])
    const [friends, setFriends] = useState([])
    const [friendsArray, setFriendsArray] = useState([{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},{profileImg,name:"Adekola Israel"},])
    const [listArray, setListArray] = useState([])
    const [search, setUserSearch] = useState("")
    const [DisplaySearch, setDisplaySearch] = useState(undefined)
    const [mutualFriendsArray, setMutualFriendsArray] = useState([])
    const [mutualRender, setMutualRender] = useState([])
    const [buttonActive, setButtonActive] = useState(true)

    useEffect(() => {
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        get(ref(db,`Users/${userNameLoc.UserName}`))
        .then((output)=>{
            if(output.exists()){
                setUserCredentials(output.val())
                console.log(output.val());
                
            }
        })
    }, [])

    useEffect(() => {
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        onValue(ref(db, `Users/${userNameLoc.UserName}/mutualFriends`),(output)=>{
            if (output.exists()) {
                setMutualFriendsArray(output.val())
            }
        })
    }, [])

    useEffect(() => {
        let temporaryStorage = []
        mutualFriendsArray.map((data, index) => {
            get(ref(db, `Users/${data}`))
            .then((output)=>{
                setMutualRender(M=>[...M,output.val()])
            })
        })
        console.log(mutualFriendsArray);
        
    }, [mutualFriendsArray])


    useEffect(() => {
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        onValue(ref(db,`Users/${userNameLoc.UserName}/friendsArray`),(output)=>{
            if(output.exists()){
                setFriends(output.val())
            }
        })
    }, [])


    const searchFriends = async () => {
        setButtonActive(false)
        const searchTerm = search.toLowerCase();
        setListArray([]);
        document.querySelector(".friends-parent h2").style.display = "none"
        try {
            const nameQuery = query(
                ref(db, "Users"),
                orderByChild("_search/fullName"),
                startAt(searchTerm),
                endAt(searchTerm + "\uf8ff")
            );
            const usernameQuery = query(
                ref(db, "Users"),
                orderByChild("_search/userName"),
                startAt(searchTerm),
                endAt(searchTerm + "\uf8ff")
            );
            const [nameSnapshot, usernameSnapshot] = await Promise.all([
                get(nameQuery),
                get(usernameQuery)
            ]);
            const combinedResults = {};
            if (nameSnapshot.exists()) {
                Object.assign(combinedResults, nameSnapshot.val());
            }

            if (usernameSnapshot.exists()) {
                Object.assign(combinedResults, usernameSnapshot.val());
            }

            const results = Object.entries(combinedResults).map(([username, userData]) => ({
            username,
            ...userData
            }));

            setListArray(results);
            document.querySelector(".friends-parent h2").style.display = "block"
            setButtonActive(B=>true)
        } catch (error) {
            console.error("Search failed:", error);
            setListArray([]);
        }
    };

    useEffect(() => {
        if (listArray.length == 0) {
            setDisplaySearch("No Result Found")
        }
        else{
            setDisplaySearch("Search Result")
        }
    }, [listArray])
    const [addFriendGo, setAddFriendGO] = useState(false)
    const addFriend = (params,e) =>{
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        const userName = userNameLoc.UserName
        const parentId = e.target.offsetParent.id
        let paramsArray = []
        document.querySelector(`#${parentId} .message-btn`).style.display = "block"
        document.querySelector(`#${parentId}  .add-btn`).style.display = "none"
        document.querySelector(`#${parentId} .remove-btn`).style.display = "none"
        get(ref(db,`Users/${params.UserName}/friendsArray`))
        .then((data)=>{
            if(data.exists()){
                paramsArray = data.val()
            }
            update(ref(db,"Users/"+params.UserName),{
                friendsArray:[...paramsArray,{UserName:userName,Validate:false,profilePic:userCredentials.profilePic,FullName:userCredentials.FullName}],
            })
            update(ref(db,"Users/"+userName),{
                friendsArray:[...friends,{UserName:params.UserName,Validate:true,profilePic:params.profilePic,FullName:params.FullName}],
            })
        })
    }

    const confirmFriend = (output,index,e) =>{
        const previousFriend = [...friends]
        previousFriend[index].Validate = true
        update(ref(db,`Users/${userCredentials.UserName}`),{
            friendsArray:previousFriend
        })
        const parentId = e.target.offsetParent.id
        document.querySelector(`#${parentId} .message-btn`).style.display = "block"
        document.querySelector(`#${parentId}  .add-btn`).style.display = "none"
    }
    const [firstGo, setFirstGo] = useState(false)
    const [secondGo, setSecondGo] = useState(false)
    const [msgGotten, setMsgGotten] = useState(false)
    console.log(msgGotten);
    
    const message = (output) =>{
        props.setChatFriendDetail(C=>output)    
        props.setChatView(true)
        const Msg1 = output.UserName + userCredentials.UserName
        const Msg2 = userCredentials.UserName + output.UserName
        let Msg;
        let message1;
        let message2;
        get(ref(db,`Messages/${Msg1}`))
        .then((output1)=>{
            if(output1.exists()){
                message1 = Msg1
                console.log(Msg2)
            }
        }) 
        get(ref(db,`Messages/${Msg2}`))
        .then((output2)=>{
            if (output2.exists()) {
                message2 = Msg2
                console.log(Msg2)
            }
        })
        .finally(()=>{
            if(!message1 && !message2){
                console.log("omoh")
                update(ref(db, `Messages/${Msg1}`),{
                    message:"hello"
                })
                .then(()=>{
                    props.setChatInfo(M=>Msg1)
                    let mutuals = []
                    let friendMutuals = []
                    get(ref(db,`Users/${userCredentials.UserName}/mutualFriends`))
                    .then((data)=>{
                        if(data.exists()){
                            mutuals = data.val()
                        }
                        if(!(mutuals.includes(output.UserName))){
                            mutuals.push(output.UserName)
                            console.log(mutuals);
                            update(ref(db, `Users/${userCredentials.UserName}`),{
                                mutualFriends: mutuals
                            })
                        }
                    })
                    get(ref(db,`Users/${output.UserName}/mutualFriends`))
                    .then((data)=>{
                        if(data.exists()){
                            friendMutuals = data.val()
                        }  
                        if(!(friendMutuals.includes(output.UserName))){
                            friendMutuals.push(userCredentials.UserName)
                            update(ref(db, `Users/${output.UserName}`),{
                                mutualFriends: friendMutuals
                            })
                        }
                    })
                })
            }
            else{
                if(message1){
                    
                    props.setChatInfo(M=>message1)
                    let mutuals;
                    let friendMutual;
                    get(ref(db,`Users/${userCredentials.UserName}/mutualFriends`))
                    .then((data)=>{
                        console.log(data.val());
                        mutuals = data.val()
                        console.log(output.UserName);
                        const findFriend = mutuals.find(friend=>
                            friend == output.UserName
                        )
                        if(!findFriend){
                            mutuals.push(output.UserName)
                            console.log(mutuals);
                            update(ref(db, `Users/${userCredentials.UserName}/mutualFriends`),{
                                mutualFriends: mutuals
                            })
                        }
                    })
                }
                else if(message2){
                    props.setChatInfo(M=>message2)
                }
            }
        })
    }
    const[mge, setMessage] = useState("")

    const [friendStatus, setFriendStatus] = useState("");
    const [go, setGo] = useState(false)
    const [friendGo, setFriendGo] = useState(false)
    const checkFriendStatus = useRef([])
    const checkFriendArrayStatus = useRef([])

    return (
        <div className="friends-overall">
            <h1>Friends</h1>
            <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                <input type="text" placeholder='Search'value={search} onChange={(e)=>setUserSearch(e.target.value)}/>
                {buttonActive?<button onClick={searchFriends} className="SearchBtn">Search</button>:<button className="SearchBtn"><Loader/></button>}
            </div>
            <div className="friends-parent">
                <h2>{DisplaySearch}</h2>
                {
                    listArray.map((output, index) => {
                        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
                        const userName = userNameLoc.UserName
                        if (output.UserName != userName) {
                            if (friends.length === 0) {
                                return (
                                    <div id={`parent${index}`} className="friends" key={`empty-${index}`}>
                                        <img src={output.profilePic} alt="" />
                                        <div>
                                            <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                            <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                            <div className="Btn">
                                                <button onClick={(e) => addFriend(output,e)} className="add-btn">Add</button>
                                                    <button className="remove-btn">Remove</button>
                                                <button style={{display:"none"}} className='message-btn'>Cancel Request</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                                }
                                
                                else {
                                // setFriendStatus()
                                const outputName = output.UserName
                                const friendMatch = friends.find(friend => 
                                    friend.UserName ==  outputName  
                                )
                                const outputMatch = output.friendsArray.find(friend =>
                                    friend.UserName == userName
                                )
                                if(friendMatch && outputMatch){
                                    if(friendMatch.Validate == false && outputMatch.Validate == true){
                                        
                                        return(
                                            <div id={`parent${index}`} className="friends" key={`nonfriend-${index}`}>
                                                <img src={output.profilePic} alt="" />
                                                <div>
                                                    <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                                    <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                                    <div className="Btn">
                                                        <button onClick={(e) => confirmFriend(output,index,e)} style={{width:"150px"}} className="add-btn">confirm</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    else if(friendMatch.Validate == true && outputMatch.Validate == true){
                                        return (
                                                <div id={`parent${index}`} className="friends" key={`friend-${index}`}>
                                                    <img src={output.profilePic} alt="" />
                                                    <div>
                                                        <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                                        <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                                        <div className="Btn">
                                                            <button onClick={()=>{message(output)}} className='message-btn'>Message</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                    }
                                    else if (friendMatch.Validate == true && outputMatch.Validate == false) {
                                        return (
                                                <div id={`parent${index}`} className="friends" key={`friend-${index}`}>
                                                    <img src={output.profilePic} alt="" />
                                                    <div>
                                                        <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                                        <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                                        <div className="Btn">
                                                            <button className='message-btn'>Cancel Request</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                    }
                                }
                                else{
                                    return (
                                            <div id={`parent${index}`} className="friends" key={`nonfriend-${index}`}>
                                                <img src={output.profilePic} alt="" />
                                                <div>
                                                    <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                                    <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                                    <div className="Btn">
                                                        <button onClick={(e) => addFriend(output,e)} className="add-btn">Add</button>
                                                        <button className="remove-btn">Remove</button>
                                                        <button style={{display:"none"}} className='message-btn'>Cancel Request</button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                }
                            }
                        }
                        else{
                            return (
                                <div id={`parent${index}`} className="friends" key={`friend-${index}`}>
                                    <img src={output.profilePic} alt="" />
                                    <div>
                                        <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                        <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                        <div className="Btn">
                                            <button onClick={()=>{message(output)}} className='message-btn'>Message</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    })
                }
                {/* {
                (friends.find(friend=>friend.Validate == false))
                ?<h3 style={{color:"whitesmoke",fontSize:"30px"}}>Friend Request</h3>
                :null
                } */}
                {
                    friends.map((output, index) => {
                    if (output.Validate == false) {
                        return(
                            <div id={`parent${index}`} className="friends" key={`empty-${index}`}>
                                <img src={output.profilePic} alt="" />
                                <div>
                                    <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                    <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                    <div className="Btn">
                                        <button onClick={(e) => confirmFriend(output,index,e)} style={{width:"150px"}} className="add-btn">confirm</button>
                                        <button onClick={()=>{message(output)}} className="message-btn" style={{display:"none"}}>Message</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })
                }
                {mutualRender != []?<h3 style={{marginTop:"15px",color:"whitesmoke",fontSize:"27px"}}>Friends</h3>:null}
                {
                    mutualRender.map((output, index) => {
                        return (
                                <div id={`parent${index}`} className="friends" key={`friend-${index}`}>
                                    <img src={output.profilePic} alt="" />
                                    <div>
                                    <p style={{ marginTop: "-15px" }}>{output.FullName}</p>
                                    <small style={{ color: "white", position: "absolute", bottom: "10px" }}>@{output.UserName}</small>
                                    <div className="Btn">
                                        <button onClick={()=>{message(output)}} className='message-btn'>Message</button>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default FriendsComponent;
