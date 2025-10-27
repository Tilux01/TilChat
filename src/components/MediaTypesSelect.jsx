import React, { useState,useEffect, useRef } from 'react'
import playBtn  from "../images/play-1073616_640.png"
import videoPreview from "../images/video.png"


const MediaTypesSelect = ({type, data}) =>{
        if(type == "image"){
            if(data){
                const blob = new Blob([data], { type: type });
                const url = URL.createObjectURL(blob);
                return (
                    <img src={url} alt="" onClick={()=>{preview(url, type)}}/>
                )
            }
            else{
                return (<img src={imagePreview} style={{filter:"brightness(.4)"}} alt="" />)
            }
        }
        else if(type == "video"){
            if(data){
                console.log("Data", data);
                
                const blob = new Blob([data], { type: type });
                const url = URL.createObjectURL(blob);
                return (
                <div className='videoPreviewer' onClick={()=>{preview(url, type)}}>
                    <img src={playBtn} alt="" className='playBtn'/>
                    <video src={url}></video>
                </div>
                )
            }
            else{
                return (
                <img src={videoPreview} style={{filter:"brightness(.4) "}} alt="" />
                )
            }
        }
    }

export default MediaTypesSelect