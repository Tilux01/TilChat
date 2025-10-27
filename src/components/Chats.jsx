import React, { useEffect, useState } from 'react'
import "../Styles/Chats.css"
import archive from "../images/archive.png"
import profileImg from "../images/IMG-20250502-WA0019 (1).jpg"
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import {getDatabase,ref,push,set,get, query, onValue, orderByChild, equalTo, orderByKey,update,startAt,endAt} from "firebase/database"
import { useNavigate } from 'react-router-dom'

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

const Chats = (props) => {
// const [chatsArray, setChatsArray] = useState([chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,chatObj,])

// set(ref(db, `Media`), null)
// .then((response)=>{
//     console.log("deleted");
// })
// for (let index = 0; index < 4; index++) {
// }
const message = (output) =>{
    props.setChatFriendDetail(C=>output)
    props.setChatView(true)
    const Msg1 = output.UserName + props.userCredentials.UserName
    const Msg2 = props.userCredentials.UserName + output.UserName
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
                get(ref(db,`Users/${props.userCredentials.UserName}/mutualFriends`))
                .then((data)=>{
                    if(data.exists()){
                        mutuals = data.val()
                    }
                    if(!(mutuals.includes(output.UserName))){
                        mutuals.push(output.UserName)
                        console.log(mutuals);
                        update(ref(db, `Users/${props.userCredentials.UserName}`),{
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
                        friendMutuals.push(props.userCredentials.UserName)
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
                get(ref(db,`Users/${props.userCredentials.UserName}/mutualFriends`))
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
                        update(ref(db, `Users/${props.userCredentials.UserName}/mutualFriends`),{
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
    return (
        <div className='chats-overall'>
            <h1>Chats</h1>
            <input type="text" placeholder='Search'/>
            <div className="archived-parent">
            <div>
                <img src={archive} alt="" />
                <p>Archive</p>
            </div>
            <h6>@</h6>
            </div>
            <div className="chats-parent">
                {
                    props.mutualRender.map((output,index)=>(  
                    <div className='chat' key={index} onClick={()=>message(output)}>
                        <img src={output.profilePic} alt="" />
                        <div style={{display:"flex",flexDirection:"column"}}>
                            <p>{output.FullName}</p>
                            <small style={{color:'whitesmoke'}}>@{output.UserName}</small>
                        </div>
                    </div>
                        ))
                }
            </div>
        </div>
    )
}

export default Chats
