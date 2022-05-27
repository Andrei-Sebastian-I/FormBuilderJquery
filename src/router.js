import Vue from 'vue'
import VueRouter from 'vue-router'
import DashboardLayout from '@/layout/DashboardLayout'
import AuthLayout from '@/layout/AuthLayout'
import firebase from '@/config/db.js';


Vue.use(VueRouter)


  
const  routes=  [
    {
      path: '/',
      redirect: 'dashboard',
      component: DashboardLayout,
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "demo" */ './views/Dashboard.vue'), 
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/forms',
          name: 'forms',
          component: () => import(/* webpackChunkName: "demo" */ './views/Forms.vue'),
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/form-create',
          name: 'form create',
          component: () => import(/* webpackChunkName: "demo" */ './views/FormCreate.vue'),
          meta: {
            requiresAuth: true
          }
        },{
          path: '/form-update/:id',
          name: 'form update',
          component: () => import(/* webpackChunkName: "demo" */ './views/UpdateForm.vue'),
          meta: {
            requiresAuth: true
          }
        },{
          path: '/form-data/:id',
          component: () => import(/* webpackChunkName: "demo" */ './views/FormData.vue'),
          name: 'form data',
          meta: {
            requiresAuth: true
          }
        },{
          path: '/files',
          component: () => import(/* webpackChunkName: "demo" */ './views/FileHandle.vue'),
          name: 'files',
          meta: {
            requiresAuth: true
          }
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import(/* webpackChunkName: "demo" */ './views/UserProfile.vue'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/',
      redirect: 'login',
      component: AuthLayout,
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import(/* webpackChunkName: "demo" */ './views/Login.vue'),
          meta: {
            requiresGuest: true
          }
        }
      ]
    }
  ]




const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes
});


  //router Guards
router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('/login');
  else if (!requiresAuth && currentUser) next('/dashboard');
  else next();
});



export default router