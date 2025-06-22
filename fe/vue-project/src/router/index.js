import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '../views/Login.vue';
import Admin from '@/views/Admin.vue';
import Locations from '@/views/Locations.vue';
import Map from '@/views/Map.vue';
import CreateUser from '@/views/CreateUser.vue';
import MapForCreateUser from '@/views/MapForCreateUser.vue';
import ManageUser from '@/views/ManageUser.vue';
import EditUser from '@/views/EditUser.vue';
import axios from 'axios';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/',
      component: Admin,
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: 'locations',component: Locations
        },
        {
          path:'create-user',component: CreateUser
        },
        {
          path: 'manage-user',component: ManageUser
        },
        {
          path: 'edit-user/:cardId',component: EditUser
        }
      ]

    },
    {
      path: '/map/:id',component: Map
    }
    ,{
      path: '/create-polygon',component: MapForCreateUser
    }

    
  ],
});

router.beforeEach(async (to,from,next) => {
   const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth) {
    try {
      const api = axios.create({
          baseURL: import.meta.env.VITE_BACKEND_URL,
          withCredentials: true
      });
      await api.get('/admin/check-auth', {
        withCredentials: true
      }); 
      next();
    } catch (err) {
      console.error('Auth check error:', err);
      next('/login');
    }
  } else {
    next();
  }
}) 

export default router
