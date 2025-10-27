import { useState,createContext,useEffect } from 'react'
import SideComponents from './components/SideComponents.jsx'
import View from './components/View.jsx'
import WitChat from './components/WitChat.jsx'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import SignUp from './Pages/SignUp.jsx'
import SignIn from './Pages/SignIn.jsx'
import ChatDisplay from './components/ChatDisplay.jsx'
import FeedPreview from './components/FeedPreview.jsx'


export const ViewStateContext = createContext()
function Home(props) {
  const [chat, setChat] = useState(false)
  const [chatInfo, setChatInfo] = useState("Hello world")
  const [chatFriendDetail, setChatFriendDetail] = useState([])
  const [feedObject, setFeedObject] = useState({})
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