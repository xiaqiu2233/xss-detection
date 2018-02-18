import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'search-bar',
      component: require('@/components/SearchBar').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
