<template lang='pug'>
  #moveRythm
    .movePic
      .imgContainer
        img(:src="imgSrc")
      .imgLiner(:style="{left: leftValue + 'px', top: topValue + 'px'}" v-if='showFlag')
    audio(id="myaudio" :src="videoSrc" controls="controls" loop="false" hidden="true")
    input.playbtn(type="button" @click="play()" value="播放")
</template>
<script>
export default {
  name: 'vMove',
  data () {
    return {
      imgSrc: require('../assets/img/iCard.jpg'),
      videoSrc: require('../medias/paomo.mp3'),
      leftValue: 50,
      topValue: 85,
      moveTimer: '',
      showFlag:true,
      isplaying: false
    }
  },
  created () {
  },
  methods: {
    moveFun () {
      let img = new Image()
      img.src = this.imgSrc
      this.moveTimer = setInterval(() => {
        this.leftValue++
        if (this.leftValue > (img.width - 50)) {
          this.leftValue = 50
          this.topValue = this.topValue + 180
          this.leftValue ++
          if (this.topValue > (img.height - 85)) {
            clearInterval(this.moveTimer)
            this.showFlag = false
            this.leftValue = 50
            this.topValue = 85
          }
        }
      }, 100)
    },
    play(){
        var audio =document.querySelector('#myaudio')
        if(!this.isPlaying){
          audio.play()
          this.isPlaying = true
          this.moveFun()
        } else {
          clearInterval(this.moveTimer)
          audio.pause()
          this.isPlaying = false
        }
    },
  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.movePic
    width 500px
    height 660px
    position relative
    overflow: hidden;
.imgContainer
    position absolute
    top 0
    left 0
    right 0
    bottom 0
.imgLiner
    width 2px
    height 150px
    position absolute
    background-color #ff3b00
.playbtn
    width 100px
    height 48px
    line-height 18px
    background-color #ffe600
</style>
