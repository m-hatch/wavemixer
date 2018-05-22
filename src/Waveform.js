import React from "react";
import ReactDOM from "react-dom";
import WaveSurfer from "wavesurfer";
import Dropdown from 'react-dropdown';


export default class Waveform extends React.Component {
  constructor() {
    super();

    // ref for wavesurfer container element
    this.waveform = React.createRef();

    // bound functions
    this.resetPlayhead = this.resetPlayhead.bind(this);
    this.setInitialPlayhead = this.setInitialPlayhead.bind(this);
    this.getProgress = this.getProgress.bind(this);
    this.removeFile = this.removeFile.bind(this);

    this.wavesurfer = null
  
    // this.state = {
    //   wavesurfer: null
    // };
  }

  componentDidMount() {

    const wavesurfer = WaveSurfer.create({
      container: this.waveform.current,
      waveColor: "violet",
      progressColor: "purple",
      height: 50,
      responsive: 2.0
    });

    wavesurfer.load(this.props.src);
    wavesurfer.on('seek', this.props.updateProgress)
    wavesurfer.on('pause', this.getProgress)
    wavesurfer.on('ready', this.setInitialPlayhead)
    wavesurfer.on('finish', () => {
      this.wavesurfer.stop();
      this.props.resetPlayhead();
    })


    // Hack to make wavesurfer resize
    const responsiveWave = wavesurfer.util.debounce(function() {
      wavesurfer.empty();
      wavesurfer.drawBuffer();
    }, 150);
    
    window.addEventListener('resize', responsiveWave);

    this.wavesurfer = wavesurfer;

  }

  componentWillReceiveProps(newProps) {
    console.log('will receive props')
    if (newProps.progress !== this.props.progress) {
      console.log('if 1')
      this.wavesurfer.seekTo(newProps.progress);
    }
    if (newProps.isPlaying === true) {
      console.log('if 2')

      this.wavesurfer.play();
    }
    if (newProps.isPlaying === false && newProps.isPlaying !== this.props.isPlaying) {
      console.log('if 3')

      this.wavesurfer.pause();
    } 
    if (newProps.isAtBeginning === true && newProps.isAtBeginning !== this.props.isAtBeginning) {
      console.log('if 4')

      this.resetPlayhead();
    }
    if (newProps.src !== this.props.src) {
      console.log('if 5')

      this.wavesurfer.load(newProps.src)
    }
  }

  resetPlayhead() {
    this.wavesurfer.seekTo(0);
  }

  setInitialPlayhead() {
    if (this.props.progress !== 0) {
      this.wavesurfer.seekTo(this.props.progress)
    }
  }

  getProgress() {
    const current = this.wavesurfer.getCurrentTime();
    const duration = this.wavesurfer.getDuration();
    const progress = current/duration
    this.props.updateProgress(progress)
  }

  removeFile() {
    this.props.removeFile(this.props.idx);
    this.wavesurfer.pause();
  }

  render() {
    console.log('render', this.props)
    let idx = this.props.idx;
    return (
      <div>
        <div ref={this.waveform} />
        <div style={{display: 'flex'}}>
          <paper-range-slider snaps pin step='1' min='0' max='100' value-diff-min="10" value-diff-max="50" value-min='30' value-max='60'></paper-range-slider>
          <Dropdown options={this.props.options} onChange={(e) => this.props.handleMenuChange(e, idx)} value={this.props.name} placeholder="Select an option" />
          <button onClick={() => this.removeFile() }>remove</button>
        </div>
      </div>
    );
  }
}

Waveform.defaultProps = {
  src: ""
};
