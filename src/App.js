import React from 'react';
import AudioSourceControls from './components/AudioSourceControls'
import io from "socket.io-client"
import './App.css';


const socket = io.connect('http://localhost:4000');

export class App extends React.Component{
  constructor(props)
  {
    super(props);
  }
  // this should be called when a child object requests to stream audio to server
  uploadStream(id)
  {
     socket.emit("stream", {
      meta : {
        id : id
      },
      body:
      {

      }}
     
     )
  }
  render(){

    return(
      <AudioSourceControls callbacks = {{parentUploadStream : this.uploadStream}}/>
    )
  }
}

export default App;
