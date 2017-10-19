<template lang='pug'>
  .mp-wrapper
    #waveform
    input(class="slideRange" ref="slider" type="range" min="1" max="20" value="1" v-on:input='zoomInput')
    el-button(type="primary" @click="wavesurfer.playPause()") Play/Pause
  </div>
</template>

<script>
// import Baby from 'babyparse.js'
import WaveSurfer from 'wavesurfer.js'
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js'
import MinimapPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.minimap.min.js'
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'

export default {
  name: 'hello',
  data () {
    return {
      videoSrc: require('../medias/paomo.mp3'),
      wavesurfer: '',
      iRegions: [],
      jsonSrc: 'test.json'
    }
  },
  created () {
    // Papa.parse(('../../static/test.csv'), {
    //   complete: function(results) {
    //     download: true,
    //     console.log("Finished:", results.data);
    //   }
    // })
    // let parsed = Baby.parseFiles('test.csv')
    // console.log(parsed)
    this.$http.get('../../static/test.csv').then(function(data) {
      var allRows = data.body.split(/\r?\n|\r/)
      var endRows = []
      for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
        endRows.push(allRows[singleRow].split(','))
      }
      console.log(allRows,endRows)
    }).catch(function(response) {
      console.log('数据加载失败,请尝试刷新页面')
    })
    this.iRegions = [
      {
        start: 0,
        end: 32,
        color: 'hsla(400, 100%, 30%, 0.5)',
        drag: false
      }, {
        start: 32,
        end: 64,
        color: 'hsla(100, 30%, 70%, 0.3)'
      }, {
        start: 64,
        end: 96,
        color: 'rgba(43, 84, 202, 0.35)'
      }, {
        start: 96,
        end: 128,
        color: 'rgba(202, 43, 95, 0.3)'
      }, {
        start: 128,
        end: 160,
        color: 'hsla(200, 50%, 70%, 0.4)'
      }, {
        start: 160,
        end: 192,
        color: 'hsla(500, 50%, 70%, 0.4)'
      }, {
        start: 192,
        end: 226,
        color: 'hsla(600, 50%, 70%, 0.4)'
      }, {
        start: 226,
        end: 258,
        color: 'hsla(700, 50%, 70%, 0.4)'
      }, {
        start: 258,
        end: 290,
        color: 'hsla(800, 50%, 70%, 0.4)'
      }
    ]
  },
  methods: {
    zoomInput () {
      var zoomLevel = Number(this.$refs.slider.value)
      this.wavesurfer.zoom(zoomLevel)
    }
  },
  mounted () {
    let self = this
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      waveColor: 'darkorange',
      progressColor: 'purple',
      splitChannels: false,
      height: 100,
      interact:true,
      plugins: [
        MinimapPlugin.create(),
        RegionsPlugin.create({
          regions: self.iRegions,
          dragSelection: {
            slop: 5
          }
        // plugin options ...
        }),
        TimelinePlugin.create({
            container: '#waveform'
        })
      ]
    })
    this.wavesurfer.load(require('../medias/paomo.mp3'))
    this.wavesurfer.on('ready', function () {
      // wavesurfer.play()
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.mp-wrapper
  width 100%
  position relative
  margin-top 50px
.slideRange
  position absolute
  top 45px
  right -65px
  width 100px
  height 8px
  transform rotate(90deg)
</style>
