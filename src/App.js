import React from 'react';
import AudioSourceControls from './components/AudioSourceControls'
import io from "socket.io-client"
import Peer from 'simple-peer'
import './App.css';


const socket = io.connect('http://localhost:4000');
const myID = socket.id;
var serverID;

export class App extends React.Component{
  constructor(props)
  {
    super(props);
  }
  // this should be called when a child object requests to stream audio to server
  uploadStream(id, stream)
  {
    const peer = new Peer({
      initiator: true,
      trickle : false,
      stream : stream
    });

    socket.emit('streamRequest');
    socket.on('serverCallback', (data) =>{
      console.log(`server responded to stream request with : ${data}`);
    })

   //Peer.on("signal", data => 
   //{
   //  socket.emit("startRadioStream", {signalData:data})
   //})

   //Peer.on("stream", strean => {
   //    console.log("Stream from server");
   //    console.log(stream);
   //})



    console.log(stream);
    
    // 
    // , {
    //  meta : {
    //    id : id
    //  },
    //  body:
    //  {
//
    //  }}
    // 
    // )
  }
  render(){

    return(
      <AudioSourceControls callbacks = {{parentUploadStream : this.uploadStream}}/>
    )
  }
}

export default App;
