import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
const scrollBehavior = (to, from, savedPosition) => {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}
    if (to.hash) {
      position.selector = to.hash
    }
  }
}
export default new Router({
  mode: 'history',
  scrollBehavior,
  routes: [{
  		path: '/',
      	component: r => require.ensure([], () => r(require('../Page')), 'mpaiment-nav'),
      	children: [
      		{
	      		path: '/vMindex',
	      		name: 'vMindex',
	      		component: r => require.ensure([], () => r(require('../components/Hello')), 'vM-index')
	    	},
	    	{
	      		path: '/vMicro',
	      		name: 'vMicro',
	      		component: r => require.ensure([], () => r(require('../components/Microphone')), 'vM-micro')
	    	}
    	]
  	}]
})
