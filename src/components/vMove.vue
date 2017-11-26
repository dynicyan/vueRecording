<template lang='pug'>
  .movePic
    .imgContainer
      img(:src="require('../assets/img/iCard.jpg')" ref='imgPz')
    .imgLiner(:style="{left: leftValue + 'px', top: topValue + 'px'}")
</template>
<script>
export default {
  name: 'vMove',
  data () {
    return {
      leftValue: 50,
      topValue: 85
    }
  },
  created () {
      console.log(this.$refs.imgPz)
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
