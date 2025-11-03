import { useState,createContext,useEffect } from 'react'
import SideComponents from './components/SideComponents.jsx'
import View from './components/View.jsx'
import WitChat from './components/WitChat.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import SignUp from './Pages/SignUp.jsx'
import SignIn from './Pages/SignIn.jsx'
import ChatDisplay from './components/ChatDisplay.jsx'
import FeedPreview from './components/FeedPreview.jsx'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from "firebase/analytics";
import {getDatabase,ref,push,set,get, query, onValue, orderByChild, equalTo, orderByKey,update,startAt,endAt} from "firebase/database"

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


export const ViewStateContext = createContext()
function Home(props) {
  const navigate = useNavigate()
  const [chat, setChat] = useState(false)
  const [chatInfo, setChatInfo] = useState("Hello world")
  const [chatFriendDetail, setChatFriendDetail] = useState([])
  const [feedObject, setFeedObject] = useState({})
  const [userName, setUserName] = useState()

  


  const userNameGet = localStorage.getItem("TilChat")
  useEffect(() => {
          if(!userNameGet){
              navigate("/signup")
          }
          else{
              setUserName(JSON.parse(userNameGet).UserName)
              
          }
      }, [navigate])
  useEffect(() => {
    const user = JSON.parse(userNameGet).UserName
    onValue(ref(db, `Users/${user}/onlineCheck`), (result)=>{
      console.log("online response",result.val())
      if (result.val()) {
        set(ref(db, `Users/${user}/onlineCheck`), null)
      }
    })
  }, [])
  return(
    <ViewStateContext.Provider value={props.ViewState}>
      <SideComponents setViewState={props.setViewState} ViewState={props.ViewState} setIframeLink={props.setIframeLink} setChatView={setChat} setChatInfo={setChatInfo} chatInfo={chatInfo} setChatFriendDetail={setChatFriendDetail} feedObject={feedObject} setFeedObject={setFeedObject}/>
      {!chat?<View setViewState={props.setViewState} ViewState={props.ViewState} iframeLink={props.iframeLink} setChatInfo={setChatInfo} feedObject={feedObject} setFeedObject={setFeedObject} setChat={setChat}/>:<ChatDisplay chatInfo={chatInfo} chatFriendDetail={chatFriendDetail}/>}
      {/* <FeedPreview/> */}
    </ViewStateContext.Provider>
  )
}

function App() {
  const [ViewState, setViewState] = useState("welcome")
  const [iframeLink, setIframeLink] = useState("")
  const navigate = useNavigate()
  const userNameGet = localStorage.getItem("TilChat")
  const [userName, setUserName] = useState()
  useEffect(() => {
      if(!userNameGet){
          navigate("/signup")
      }
      else{
          
      }
  }, [userNameGet, navigate])
  return(
    <>
      <Routes>
        <Route path='/' element={<Home ViewState={ViewState} setViewState={setViewState} iframeLink={iframeLink} setIframeLink={setIframeLink}/>}/>
        <Route path='/dashboard' element={<Navigate to='/'/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/login' element={<Navigate to='/signin'/>}/>
        <Route path='*' element={<SignUp/>}/>
      </Routes>
    </>
  )
}

export default App