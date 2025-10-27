import React from 'react'

const VideoPlayer = (props) => {
  return (
    <div className='main-video-player' style={{width:"100%"}}>
       <iframe src={`https://www.youtube.com/embed/${props.iframeLink}?autoplay=1&rel=0`} frameborder="0" style={{width:"100%",height:"100vh"}} allowFullScreen></iframe>
    </div>
  )
}

export default VideoPlayer
