import React from 'react';
const { desktopCapturer } = window.require('electron');

class AudioSourceControl extends React.Component{    
    constructor(props)
    {
        super(props);
        this.state = 
        {
            outputEnabled : false,
            data : this.props.data,
            blobs : [],
            recorder : {}// recorder for single stream
        }
    }

    async handleStream(stream)
    {
        // TODO clear blobs?
        //setState({recorder: new MediaRecorder(stream, {mimeType: 'video/webm;codecs=vp9'})});
        //state.recorder.ondataavailable = (event) =>
        //
        //his.state.blobs.push(event.data);
        //
        //ls every 100 milisecond 
        //state.recorder.start(100);
        this.props.callbacks.parentStreamSocket(this.state.data.source.id, stream);
    }
    async startRecord()
    {   
        console.log("start record")
        try
        {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                     chromeMediaSource: 'desktop'
                    }
                },
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: this.state.data.source.id,
                    minWidth: 1280,
                    maxWidth: 1280,
                    minHeight: 720,
                    maxHeight: 720
                  }
                }
            })
            this.handleStream(stream)
        }
        catch (err)
        {
            console.log(err);
        }
    }
    stopRecord()
    {
        this.state.recorder.stop();
    }

    toggleOutput = () => {
        this.setState({outputEnabled : !this.state.outputEnabled}, () =>
        {
            console.log(this.state.outputEnabled);
            if (this.state.outputEnabled === true)
            {
                this.startRecord();
            }
            else
            {
                this.stopRecord();
            }
        });
    }



    render()

    {
        return(
            <div>
            <audio className = "player"></audio>
            <button className = "AudioSourceControl" onClick = {() => this.toggleOutput()}>
                {this.state.data.source.name}
            </button>
            </div>
        );
    }

}

// this is container for a list of media sources from desktop. Might need to be refactored to contain output devices instead.
export default class AudioSourceControls extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            sourcesReady : false,
            sources : []
        };
        this.setSources();
    }
    // this is called from single audio source control with id of window, passes control to parent
    streamSocket(id, stream)
    {
        this.props.callbacks.parentUploadStream(id, stream);
    }

    async setSources()
    {
        let audioWindows = await desktopCapturer.getSources({ types: ['window'] });
        for (const audioWindow of audioWindows)
        {
            this.state.sources.push(audioWindow);
        }
        this.setState((state) =>{
                return {sourcesReady : true}
            });
    }
    renderSource(value)
    {
        return <AudioSourceControl 
        key = {value.id} 
        data = {{source : value}}
        callbacks = {{parentStreamSocket : (id, stream) => this.streamSocket(id, stream)}}/>
    }

    render()
    {        
        return(
            <div className ="audioSourceControls">
                {this.state.sources.map((value) => this.renderSource(value))}
            </div>
        )
    }

}

