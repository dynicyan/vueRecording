<template lang='pug'>
  #app
    router-view
</template>

<script>
export default {
  name: 'app',
  created () {
    this.$router.beforeEach((to, from, next) => {
      //  continue to next page
      next()
    })
  }
}
</script>

<style lang='sass'>
</style>
