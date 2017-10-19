<template lang="pug">
  .hello
    h1 {{ msg }}
    ul
      li(v-for='(list, index) in textLists')
        router-link(:to='list.link') {{list.name}}
      router-view
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'VUE touchMusic',
      textLists: [
        {
          name: '录音',
          link: '/vMicro'
        },
        {
          name: '音波',
          link: '/vMindex'
        }]
    }
  },
  methods: {
  	reload () {
  		if (this.$route.path !== '/vMindex') {
  			location.reload()
  		}
  	}
  },
  watch: {
  	'$route': 'reload'
  }
}
</script>
<style lang="stylus">
h1, h2
  font-weight normal
.hello
  margin 0 auto
  width 980px
  min-height 600px
  background #fff
  h1
    margin 10px 0
    font-size 20px
ul
  list-style-type none
  padding 0

li
  display inline-block
  margin 0 10px
  a
    font-size 16px
    padding 3px 5px
  .router-link-active
    background #42b983
    color #fff
a
  cursor pointer
  color #42b983
</style>
