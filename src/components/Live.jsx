import profileImg from "../images/IMG-20250502-WA0019 (1).jpg";
import React, { useState, useRef, useEffect } from "react";
import "../Styles/Live.css";
import axios from "axios";
import Loader from "./Loader";

const Live = (props) => {
    const [searchLive, setSearchLive] = useState("")
    const [buttonActive, setButtonActive] = useState(true)
    const watch = (e) =>{
        props.setChatView(false)
        props.setViewState(V=>"VideoPlayer")
        const parent = e.target.offsetParent.id
        const Id = document.querySelector(`#${parent} small`).textContent
        props.setIframeLink(I=>Id)
    }
    return (
        <div className="live-overall">
        <h1>Live</h1>
        <div className="search-parent">
            <input type="text" placeholder="Search" value={searchLive} onChange={(e)=>setSearchLive(S=>e.target.value)}/>
            {buttonActive?<button onClick={()=>{props.fetchVideo(searchLive)}}>Search</button>:<button><Loader/></button>}
        </div>
        <div className="liveBrowse">
            <h2>Browse</h2>
            <div>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("sport")}}>Sport</button>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("entertainment")}}>Entertainment</button>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("music")}}>Music</button>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("News")}}>News</button>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("Game")}}>Gaming</button>
                <button className="liveBrowse-btn" onClick={()=>{props.fetchVideo("Video")}}>Videos</button>
            </div>
        </div>
        <div className="live-parent">
            {props.videoItems.map((output, index) => (
            <div className="live" key={index} id={"videoParent"+index}>
                <img src={output.snippet.thumbnails.high.url} alt="" />
                <div>
                <div>
                    <p>{output.snippet.title}</p>
                    <small style={{display:"none"}}>{output.id.videoId}</small>
                </div>
                <button onClick={watch}>Watch Live</button>
                </div>
            </div>
            ))}
        </div>
        </div>
    );
};

export default Live;
