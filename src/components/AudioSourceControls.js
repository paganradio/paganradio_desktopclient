import React from 'react';
const { desktopCapturer } = window.require('electron');

class AudioSourceControl extends React.Component{    
    constructor(props)
    {
        super(props);
        this.state = 
        {
            outputEnabled : false,
            streamSocketId : props.source,
            source : this.props.source,
            blobs : []
        }
    }
    recorder

    handleStream(stream)
    {
        console.log("handleStream");
        this.recorder = new MediaRecorder(stream, {mimeType: 'video/webm;codecs=vp9'});
        this.recorder.ondataavailable = (event) =>
        {
            this.state.blobs.push(event.data);
        }
        this.recorder.start(100);
        console.log(this.recorder);

    }
    handleError(e)
    {
        console.log(e);
    }
    async startRecord()
    {   
        console.log("start record")
        try
        {
            console.log(this.state.source.id);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    mandatory: {
                     chromeMediaSource: 'desktop'
                    }
                },
                video: {
                  mandatory: {
                    chromeMediaSource: 'desktop',
                    chromeMediaSourceId: this.state.source.id,
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
            this.handleError(err);
        }
    }
    stopRecord()
    {
        this.recorder.stop();
        console.log(this.recorder);
        console.log(this.state.blobs);
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
            <button className = "AudioSourceControl" onClick = {this.toggleOutput}>
                {this.state.source.name}
            </button>
            </div>
        );
    }

}

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
    setSources()
    {
        var that = this;
        desktopCapturer.getSources({ types: ['window'] })
        .then(async audioWindows => {
            for (const audioWindow of audioWindows)
            {
                that.state.sources.push(audioWindow);
            }
          })
        .then(() => 
        {
            that.setState((state) =>{
                return {sourcesReady : true}
            });
        });
    }
    renderSource(value)
    {
        return <AudioSourceControl key = {value.id} source = {value}/>
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

