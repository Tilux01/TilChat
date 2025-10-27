import React, { useState,createContext } from 'react'
import ViewWelcome from './ViewWelcome'
import AIComponent from './AIComponent'
import Sider from './Sider'
import VideoPlayer from './VideoPlayer'
import ChatDisplay from './ChatDisplay'
import FeedPreview from './FeedPreview'
import { useEffect } from 'react'
import chatMediaSend from './ChatMediaSend'


const View = (props) => {
  if (props.ViewState == "welcome") {
    return(
      <>
        <ViewWelcome setViewState={props.setViewState} ViewState={props.ViewState}/> 
      </>
    )
  }
  else if(props.ViewState == "ChatBot"){
    return(
      <>
        <AIComponent setViewState={props.setViewState} ViewState={props.ViewState}/>
      </>
    )
  }
  else if(props.ViewState == "VideoPlayer"){
    return(
      <>
        <VideoPlayer setViewState={props.setViewState} ViewState={props.ViewState} iframeLink={props.iframeLink}/>
      </>
    )
  }
  else if(props.ViewState == "chat"){
    return(
      <>
        <chatMediaSend setViewState={props.setViewState} ViewState={props.ViewState} iframeLink={props.iframeLink}/>
      </>
    )
  }
  else if(props.ViewState == "feed"){
    return(
      <>
        <FeedPreview setViewState={props.setViewState} ViewState={props.ViewState} feedObject={props.feedObject} setFeedObject={props.setFeedObject}/>
      </>
    )
  }
}
export default View
