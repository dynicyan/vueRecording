<template lang='pug'>
  .micro
    #viz
      canvas.analyser(ref='analyser' width="800" height="300")
      canvas.wavedisplay(ref='wavedisplay' width="800" height="200")
    #controls
      img#record(:src="require('../assets/img/mic128.png')" @click="toggleRecording(this)" :class="[{'recording': isRecord}]")
      a#save(href="#" @click="saveAudio()")
        img(:src="require('../assets/img/save.svg')")
</template>
<script>
export default {
  name: 'vMicro',
  data () {
    return {
      audioInput: null,
      realAudioInput: null,
      inputPoint: null,
      audioRecorder: null,
      rafID: null,
      analyserContext: null,
      canvasWidth: '',
      canvasHeight: '',
      recIndex: 0,
      isRecord: false,
      audioContext: '',
      analyserNode: ''
    }
  },
  created () {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.audioContext = new AudioContext()
  },
  methods: {
    drawBuffer( width, height, context, data ) {
      var step = Math.ceil( data.length / width )
      var amp = height / 2
      context.fillStyle = "silver"
      context.clearRect(0,0,width,height)
      console.log(step)
      for(let i=0; i < width; i++){
          var min = 1.0
          var max = -1.0
          for (let j=0; j<step; j++) {
              var datum = data[(i*step)+j] 
              if (datum < min)
                  min = datum
              if (datum > max)
                  max = datum
          }
          context.fillRect(i,(1+min)*amp,1,Math.max(1,(max-min)*amp));
      }
    },
    saveAudio () {
      this.audioRecorder.exportWAV(this.doneEncoding)
      // could get mono instead by saying
      // audioRecorder.exportMonoWAV( doneEncoding );
    },
    gotBuffers (buffers) {
      var canvas = this.$refs.wavedisplay
      this.drawBuffer(canvas.width, canvas.height, canvas.getContext('2d'), buffers[0] )
      // the ONLY time gotBuffers is called is right after a new recording is completed - 
      // so here's where we should set up the download.
      this.audioRecorder.exportWAV(this.doneEncoding)
    },
    doneEncoding (blob) {
      var url = (window.URL || window.webkitURL).createObjectURL(blob);
      var link = document.getElementById("save");
      link.href = url;
      link.download = "myRecording" + ((this.recIndex<10)?"0":"") + this.recIndex + ".wav"
      this.recIndex ++
    },
    toggleRecording () {
      if (this.isRecord) {
        this.audioRecorder.stop()
        this.isRecord = false
        this.audioRecorder.getBuffer(this.gotBuffers)
      } else {
        if (!this.audioRecorder)
            return
        this.isRecord = true
        this.audioRecorder.clear()
        this.audioRecorder.record()
      }
    },
    convertToMono( input ) {
      var splitter = this.audioContext.createChannelSplitter(2)
      var merger = this.audioContext.createChannelMerger(2)
      input.connect( splitter )
      splitter.connect( merger, 0, 0 )
      splitter.connect( merger, 0, 1 )
      return merger;
    },
    cancelAnalyserUpdates() {
      window.cancelAnimationFrame( this.rafID );
      this.rafID = null;
    },
    updateAnalysers(time) {
      if (!this.analyserContext) {
          var canvas = this.$refs.analyser
          this.canvasWidth = canvas.width
          this.canvasHeight = canvas.height
          this.analyserContext = canvas.getContext('2d')
      }
      // analyzer draw code here
      {
          var SPACING = 3;
          var BAR_WIDTH = 1;
          var numBars = Math.round(this.canvasWidth / SPACING);
          var freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);

          this.analyserNode.getByteFrequencyData(freqByteData); 

          this.analyserContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
          this.analyserContext.fillStyle = '#F6D565';
          this.analyserContext.lineCap = 'round';
          var multiplier = this.analyserNode.frequencyBinCount / numBars;

          // Draw rectangle for each frequency bin.
          for (var i = 0; i < numBars; ++i) {
              var magnitude = 0;
              var offset = Math.floor( i * multiplier );
              // gotta sum/average the block, or we miss narrow-bandwidth spikes
              for (var j = 0; j< multiplier; j++)
                  magnitude += freqByteData[offset + j];
              magnitude = magnitude / multiplier;
              var magnitude2 = freqByteData[i * multiplier];
              this.analyserContext.fillStyle = "hsl( " + Math.round((i*360)/numBars) + ", 100%, 50%)";
              this.analyserContext.fillRect(i * SPACING, this.canvasHeight, BAR_WIDTH, -magnitude);
          }
      }
      this.rafID = window.requestAnimationFrame(this.updateAnalysers)
    },
    toggleMono() {
      if (this.audioInput != this.realAudioInput) {
          this.audioInput.disconnect();
          this.realAudioInput.disconnect();
          this.audioInput = this.realAudioInput;
      } else {
          this.realAudioInput.disconnect();
          this.audioInput = convertToMono(this.realAudioInput);
      }

      this.audioInput.connect(this.inputPoint);
    },
    gotStream(stream) {
      this.inputPoint = this.audioContext.createGain();
      // Create an AudioNode from the stream.
      this.realAudioInput = this.audioContext.createMediaStreamSource(stream);
      this.audioInput = this.realAudioInput;
      this.audioInput.connect(this.inputPoint);
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = 2048;
      this.inputPoint.connect(this.analyserNode);
      this.audioRecorder = new Recorder(this.inputPoint);
      let zeroGain = this.audioContext.createGain();
      zeroGain.gain.value = 0.0;
      this.inputPoint.connect(zeroGain);
      zeroGain.connect(this.audioContext.destination);
      this.updateAnalysers();
    }
  },
  mounted () {
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame
    navigator.getUserMedia({
        "audio": {
            "mandatory": {
                "googEchoCancellation": "false",
                "googAutoGainControl": "false",
                "googNoiseSuppression": "false",
                "googHighpassFilter": "false"
            },
            "optional": []
        },
    }, this.gotStream, function(e) {
        console.log(e);
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.micro
  margin-top 50px
  .analyser, .wavedisplay { 
    display: inline-block; 
    background: #202020; 
    width: 95%;
    height: 45%;
    box-shadow: 0px 0px 10px blue;
  }
  .wavedisplay{margin-top:30px}
  #controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    height: 20%;
    width: 100%;
  }
  #record { height: 15vh;border-radius: 100%;}
  .recording {
    opacity:0.5;
    background: red;
    background: -webkit-radial-gradient(center, ellipse cover, #ff0000 0%,lightgrey 75%,lightgrey 100%,#7db9e8 100%)
    background: -webkit-radial-gradient(center, ellipse cover, #ff0000 0%,lightgrey 75%,lightgrey 100%,#7db9e8 100%); 
    background: -moz-radial-gradient(center, ellipse cover, #ff0000 0%,lightgrey 75%,lightgrey 100%,#7db9e8 100%); 
    background: radial-gradient(center, ellipse cover, #ff0000 0%,lightgrey 75%,lightgrey 100%,#7db9e8 100%); 
  }
  #save, #save img { height: 10vh; }
  #save { opacity: 0.25;margin-top:300px}
  #save[download] { opacity: 1;}
  #viz {
    float: left;
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
  }
  @media (orientation: landscape) {
    body { flex-direction: row;}
    #controls { flex-direction: column; height: 100%; width: 10%;}
    #viz { height: 100%; width: 90%;}
  }
</style>
