import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '../pages/HomePage.vue'
import Register from '../pages/RegisterPage.vue'
import Login from '../pages/LoginPage.vue'
import AddPost from '../pages/AddPostPage.vue'
import PostsPage from '../pages/PostsPage.vue'
import PostDetailsPage from '../pages/PostDetailsPage.vue'
import EditPostPage from '../pages/EditPostPage.vue'
import AdminPage from '../pages/AdminPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/posts',
    name: 'Posts',
    component: PostsPage
  },
  {
    path: '/add-post',
    name: 'AddPost',
    component: AddPost,
    meta: { userOnly: true }
  },
  {
    path: '/posts/:id',
    name: 'PostDetails',
    component: PostDetailsPage
  },
  {
    path: '/edit-post/:id',
    name: 'EditPost',
    component: EditPostPage,
    meta: { userOnly: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,

  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth'
      }
    }

    return { top: 0 }
  }
})

router.beforeEach((to) => {
  const token = localStorage.getItem('token')
  const isAdmin = localStorage.getItem('isAdmin') === 'true'

  if (to.path.startsWith('/admin')) {
    if (!token) return '/login'
    if (!isAdmin) return '/'
  }

  if (to.meta.userOnly) {
    if (!token) return '/login'
    if (isAdmin) return '/admin'
  }

  if (to.path === '/login' || to.path === '/register') {
    if (token) {
      return isAdmin ? '/admin' : '/'
    }
  }
})

export default router