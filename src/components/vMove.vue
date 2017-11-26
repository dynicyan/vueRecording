<template lang='pug'>
  .movePic
    .imgContainer
      img(:src="imgSrc")
    .imgLiner(:style="{left: leftValue + 'px', top: topValue + 'px'}" v-if='showFlag')
</template>
<script>
export default {
  name: 'vMove',
  data () {
    return {
      imgSrc: require('../assets/img/iCard.jpg'),
      leftValue: 50,
      topValue: 85,
      moveTimer: '',
      showFlag:true
    }
  },
  created () {
    let img = new Image()
    img.src = this.imgSrc
    console.log(img.width, img.height)
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
    }, 10)
  },
  methods: {

  },
  mounted () {

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus">
.movePic
    width 500px
    height 667px
    position relative
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
</style>
