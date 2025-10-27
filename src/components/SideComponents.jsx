import React, { useState,useRef,useEffect, cache } from 'react'
import Status from './StatusPage.jsx'
import "../Styles/SideComponents.css"
import Sider from './Sider.jsx'
import Chats from "./Chats.jsx"
import FriendsComponent from './FriendsComponent.jsx'
import Live from './Live.jsx'
import UserStatus from './UserStatus.jsx'
import profile from "../images/IMG-20250502-WA0019 (1).jpg"
import status1 from "../images/IMG_20250502_114538.jpg"
import status2 from "../images/Screenshot_2025-01-05-13-22-35-415_com.whatsapp (1).jpg"
import StatusPage from "./StatusPage.jsx"
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import {getDatabase,onChildAdded,ref, query, orderByChild, limitToLast, onValue,get, onChildChanged,set} from "firebase/database"
import axios from 'axios'

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

const SideComponents = (props) => {
    // This is the user status Array list, distributed to friends and userStatus component using props
    useEffect(() => {
      let userName 
      const localData = JSON.parse(localStorage.getItem("TilChat"))
      userName = localData.UserName
      // onChildAdded(ref(db, `Statuses`), (snapshot) => {
      //     const lastMessage = snapshot.val();
      //     console.log(lastMessage);
      // })

    }, [])
    const [statusArray, setStatusArray] = useState([])
    const [statusType, setStatusType] = useState(false)

    
  const [changeSection, setChangeSection] = useState("Updates")
  const currentKeyIndex = useRef(0)
    const apiKeys = useRef([
      "AIzaSyCwBD9L_ZyuBOLkCDEmNaSg1edHrQ5ZhMw",
        "AIzaSyB-6MJy50nYXmnIpx7qmqYSXcC_wf6kETI",
        "AIzaSyC6UFOM9Os-3KDkKN_OZAnu_uybL32Nm_k",
        "AIzaSyBgrnCL5ejBgt4QsWb-SswGgRbLd6qYA8w",
        "AIzaSyCKVVpOIcFHRyJyr-ui7j_ln49CIyn3wZk",
        "AIzaSyDTAfESXlqUZHdhBzKXg4FXnpu4Ypvx57M",
        "AIzaSyABTAd0wBKQPLQ55QqU5O-9jgHePpTpqoU",
        "AIzaSyAaXXCURcc9GRb0Kvj1LLvBp6jJDjOyVEw",
        "AIzaSyBr4JTEnGvyi_ckOQJilC9JPESiMIkoe58",
        "AIzaSyBODDvw4PWNosDtVTVJ7QMeHyYhVdLMV3k",
        "AIzaSyBnB5Io2sC4fDCUSeIF6XBSIbc3rhk6dGo",
        "AIzaSyDpHMdIAJKnGaOYxD-k2KSOXcK2tMZcu6I",
        "AIzaSyAVyZhPvqPFPHSvuHnBzBrQJVdrdOQhqzM",
        "AIzaSyDgbZ-fYb5jgLamjJLmXr77SLBfJQR169w",
        "AIzaSyArBJAmT2tJUbABRM3Ee54m-wZgLGGzWUY",
        "AIzaSyD0-lTek_Pe8-5mPiPjZUmMwmOeeJEL30Y",
      ])

    const [videoItems, setVideoItems] = useState([])
    const [videoSearch, setVideoSearch] = useState("sport")
    const [fetchStatus, setFetchStatus] = useState()
    

    const arrayList = [{name:"Israel",profile,statuses:[status1,status2,profile,status2,status1]},{name:"Israel",profile,statuses:[status1,status2]},{name:"Israel",profile,statuses:[status1,status2]},{name:"Israel",profile,statuses:[status1,status2]},{name:"Israel",profile,statuses:[status1,status2]},{name:"Israel",profile,statuses:[status1,status2]}]
    const [friendStatusArray, setFriendStatusArray] = useState([])
    const [statusCollection, setStatusCollection] = useState([])
    const [pendingStatusCollection, setPendingStatusCollection] = useState([])
    const [filterStatus, setFilterStatus] = useState([])
    const [proceedSave, setProceedSave] = useState(false)
    const [procedAfterDelete, setProceedAFterDelete] = useState(false)
    


    // Get FriendsList
    const [userCredentials, setUserCredentials] = useState([])
    const [mutualFriendsArray, setMutualFriendsArray] = useState([])
    const [mutualRender, setMutualRender] = useState([])
    
    useEffect(() => {
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        get(ref(db,`Users/${userNameLoc.UserName}`))
        .then((output)=>{
            if(output.exists()){
                setUserCredentials(output.val())
            }
        })
    }, [])
    
    
    useEffect(() => {
        const userNameLoc = JSON.parse(localStorage.getItem("TilChat"))
        onValue(ref(db, `Users/${userNameLoc.UserName}/mutualFriends`),(output)=>{
            if (output.exists()) {
                setMutualFriendsArray(output.val())
                console.log(mutualFriendsArray);
                
            }
        })
    }, [])
    
    useEffect(() => {
        console.log(mutualFriendsArray);
        
        mutualFriendsArray.map((data, index) => {
            get(ref(db, `Users/${data}`))
            .then((output)=>{
                setMutualRender(M=>[...M,output.val()])
            })
            .finally(()=>{
            })
        })
    }, [mutualFriendsArray])
    // 

    const saveUserStatus = async(directory, data) =>{
        const cache = await caches.open('TilCache')
        const response = new Response(JSON.stringify(data))
        await cache.put(directory, response)
    }

    const getUserStatus = async(key)=>{
        const cache = await caches.open("TilCache")
        const response = await cache.match(key)
        return response? await response.json() : null
    }

    useEffect(() => {
        if (filterStatus.length == 0) {
            getUserStatus('/TilChatStatus')
            .then((output)=>{
                if (output) {
                    setFilterStatus(()=>output)
                }
            })
        }
        setProceedSave(()=>true)
    }, [])

    useEffect(()=>{
        if (proceedSave) {
            if(filterStatus.length !== 0){
                saveUserStatus('/TilChatStatus', filterStatus)
            }
        }
    }, [filterStatus])


        useEffect(() => {
            const localData = JSON.parse(localStorage.getItem("TilChat"))
            const userName = localData.UserName
            onValue(ref(db, `Users/${userName}/StatusPending/list`),(output)=>{
                if (output.exists()) {
                    if (statusCollection.length == 0) {
                        setStatusCollection(()=>output.val())
                        set(ref(db, `Users/${userName}/StatusPending`), null)
                        .then(()=>{
                            console.log("Erased successfully");
                        })
                        .catch((err)=>{
                            console.log("Error deleting setDocument: ", err);
                            
                        })
                        console.log("collection is empty",statusCollection)
                    }
                    else{
                        setPendingStatusCollection(prev=>[...prev, output.val()])
                        set(ref(db, `Users/${userName}/StatusPending`), null)
                        .then(()=>{
                            console.log("Erased successfully");
                        })
                        .catch((err)=>{
                            console.log("Error deleting setDocument: ", err)
                        })
                        console.log("collection pending", pendingStatusCollection)
                    }
                }
            })
        }, [])
    
        useEffect(() => {
            
            if(pendingStatusCollection.length > 0){
                if(statusCollection.length == 0){
                    setStatusCollection(()=>pendingStatusCollection)
                }
            }
        }, [statusCollection, pendingStatusCollection])
    
        useEffect(() => {
            if (statusCollection.length > 0) {
                statusCollection.map((output)=>{
                    get(ref(db, `Statuses/${output.userName}/${output.key}`))
                    .then((output)=>{
                        setFilterStatus(prev=>[...prev, output.val()])
                    })
                })
                setStatusCollection(()=>[])
            }
        }, [statusCollection])
        
        const [allStatusUser, setAllStatusUser] = useState([])
        useEffect(() => {
            let tempHold
            tempHold = allStatusUser
            const localData = JSON.parse(localStorage.getItem("TilChat"))
            const userName = localData.UserName
            setAllStatusUser(()=>[])
            filterStatus.map((output)=>{
                if (!tempHold.includes(output.userName)) {
                    if(output.userName != userName){
                        tempHold.push(output.userName)
                        setAllStatusUser(()=>tempHold)
                    }
                }
            })
        }, [filterStatus])

        useEffect(() => {
            if (filterStatus.length > 0) {
                deleteOutdatedStatus()
            }
        }, [filterStatus])

        const [sortUsers, setSortUsers] = useState([])
        const deleteOutdatedStatus = () =>{
            if(filterStatus && filterStatus.length > 0){   
                let allData
                let allIndex = []
                filterStatus.map((output, index)=>{
                    const currentDate = Date.now()
                    if (currentDate > output.endStamp) {
                        allIndex.push(index)
                    }
                })
                allIndex.map((index)=>{
                    allData = filterStatus
                    allData.splice(index, 1)
                    setFilterStatus(()=>allData)
                })
                let testData =[]
                setSortUsers(()=>[])
                const collectSortedUsers = []
                allStatusUser.map((output, index)=>{
                    testData = []
                    filterStatus.map((status,index)=>{
                        if (output == status.userName) {
                            testData.push(status)
                        }
                    })
                    collectSortedUsers.push({[output]:testData})
                    setSortUsers(()=>collectSortedUsers)
                    testData = []
                })
                saveUserStatus('/TilChatStatus', filterStatus)
            }
        }
        let testData =[]
        useEffect(() => {
            setSortUsers(()=>[])
            const collectSortedUsers = []
            allStatusUser.map((output, index)=>{
                testData = []
                filterStatus.map((status,index)=>{
                    if (output == status.userName) {
                        testData.push(status)
                    }
                })
                collectSortedUsers.push({[output]:testData})
                setSortUsers(()=>collectSortedUsers)
                testData = []
            })
        }, [filterStatus,allStatusUser])



    const [feed, setFeed] = useState([])
    // Feed section
        // useEffect(() => {
        //     axios.get("https://newsapi.org/v2/top-headlines?country=us&apiKey=41181213ecd644ae9230d93ad0b40544")
        //     .then((output)=>{
        //         setFeed(()=>output.data.articles)
        //     })
        // }, [])
    // 
    
    const fetchVideo = (params) => {
        const sport = params;
        const API_KEY = apiKeys.current[currentKeyIndex.current]
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&eventType=live&type=video&maxResults=12&q=${encodeURIComponent(sport)}&key=${API_KEY}`)
            .then(response => {
            if (!response.ok) {
            }
            return response.json();
        })
        .then(data => {
            if(data.items != undefined){
                setVideoItems(V=>data.items)
                currentKeyIndex.current = 0
                return Promise.reject('Items Recieved')

            }
            if(data.error.message.includes("The request cannot be completed because you have exceeded your")){
                if(currentKeyIndex.current >= apiKeys.current.length-1){
                    alert("server error, pls try  again later")
                }
                else{
                    currentKeyIndex.current = currentKeyIndex.current + 1
                    fetchVideo()
                }
            }
            })
            .catch(error => {
                if (error.message.includes("Failed to fetch")) {
                    console.error("Network/CORS Issue Detected");
                }
        });
    };
  if (changeSection == "Updates") {
      return (
        <div className='side-components-parent'>
            <Sider setChangeSection={setChangeSection} setViewState={props.setViewState} ViewState={props.ViewState} fetchVideo={fetchVideo} setChatView={props.setChatView}/>
            <div className='status-Parent' style={{height:"100%"}}>
                {statusType?<UserStatus statusArray={statusArray} setStatusArray={setStatusArray} setStatusType={setStatusType}/>:<StatusPage setStatusType={setStatusType} sortUsers={sortUsers} allStatusUser={allStatusUser} filterStatus={filterStatus} feed={feed} setFeed={setFeed} setViewState={props.setViewState} ViewState={props.ViewState} feedObject={props.feedObject} setFeedObject={props.setFeedObject} setChatView={props.setChatView}/>}
            </div>
        </div>
      )
    }
  else if(changeSection == "Chats"){
      return (
        <div className='side-components-parent'>
            <Sider setChangeSection={setChangeSection} setViewState={props.setViewState} ViewState={props.ViewState} fetchVideo={fetchVideo} setChatView={props.setChatView}/>
            <div className='chats-Parent-overall'>
                <Chats setChatView={props.setChatView} setChatInfo={props.setChatInfo} chatInfo={props.chatInfo} setChatFriendDetail={props.setChatFriendDetail} mutualRender={mutualRender} userCredentials={userCredentials}/>
            </div>
        </div>
      )
  }
  else if(changeSection == "friends"){
      return (
        <div className='side-components-parent'>
            <Sider setChangeSection={setChangeSection} setViewState={props.setViewState} ViewState={props.ViewState} fetchVideo={fetchVideo} setChatView={props.setChatView}/>
            <div className='chats-Parent-overall'>
                <FriendsComponent setChatView={props.setChatView} setChatInfo={props.setChatInfo} chatInfo={props.chatInfo} setChatFriendDetail={props.setChatFriendDetail}/>
            </div>
        </div>
      )
  }
  else if(changeSection == "live"){
      return (
        <div className='side-components-parent'>
            <Sider setChangeSection={setChangeSection} setViewState={props.setViewState} ViewState={props.ViewState} fetchVideo={fetchVideo} setChatView={props.setChatView}/>
            <div className='chats-Parent-overall'>
                <Live fetchVideo={fetchVideo} videoItems={videoItems} setVideoSearch={setVideoSearch} videoSearch={videoSearch} setViewState={props.setViewState} ViewState={props.ViewState} setIframeLink={props.setIframeLink} setChatView={props.setChatView}/>
            </div>
        </div>
      )
  }
}

export default SideComponents
