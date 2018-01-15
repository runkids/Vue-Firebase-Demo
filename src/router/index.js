import Vue from 'vue'
import Router from 'vue-router'
import App from '../App'
import store from '../store'
import pages from '../config/page_module/pages'
import { getUserInfo } from '../api/firebase'

Vue.use(Router)

const routes = [
	{
		path: '/',
		// redirect: '/login',
		component: pages.login,
		meta: [],
	},
	{
		path: '*',
		redirect: '/runkids.io',
	},
	{
		path: '/runkids.io/',
		component: pages.home,
		children: [
			{
				path: '/user',
				component: pages.user,
				meta: ['設定', '個人資訊']
			},
		]
	}
]

const router = new Router({
	routes
});

router.beforeEach((to, from, next) => {
	let requiresAuth = to.matched.some(record => record.meta.requiresAuth);
	if (to.path !== '/' && !getUserInfo()){
		next('/');
	}else if (to.path === '/' && getUserInfo()) {
		next('/runkids.io');
	}else{
		next();
	} 
});

export default router;
