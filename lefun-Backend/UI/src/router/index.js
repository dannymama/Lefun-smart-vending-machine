import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: 'Dashboard', icon: 'dashboard' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    meta: {
      title: '客戶相關',
      icon: 'user'
    },
    children: [
      {
        path: 'basicInfo',
        name: 'basicInfo',
        component: () => import('@/views/lefun_users/user_basicInfo'),
        meta: { title: '客戶基本資料查詢', icon: 'form' }
      },
      {
        path: 'perchaseLog',
        component: () => import('@/views/lefun_users/user_transaction'),
        name: 'perchaseLog',
        meta: { title: '客戶訂單查詢', icon: 'form' }
      },
      {
        path: 'behaviorLog',
        component: () => import('@/views/lefun_users/user_behaviorLog'),
        name: 'behaviorLog',
        meta: { title: '客戶操作記錄查詢', icon: 'form' }
      }
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/list',
    name: 'News',
    meta: {
      title: '最新消息',
      icon: 'newspaper'
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/news/create'),
        name: 'CreateNews',
        meta: { title: '新增消息', icon: 'add' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/news/edit'),
        name: 'EditNews',
        meta: { title: '編輯消息', noCache: true, activeMenu: '/news/list' },
        hidden: true
      },
      {
        path: 'list',
        component: () => import('@/views/news/list'),
        name: 'NewsList',
        meta: { title: '消息列表', icon: 'newspaper' }
      }
    ]
  },

  {
    path: 'external-link',
    component: Layout,
    name: 'thirdparty',
    meta: {
      title: '第三方廠商後台',
      icon: 'example'
    },
    children: [
      {
        path: 'https://vendor-stage.ecpay.com.tw/User/LogOn_Step1',
        meta: { title: '綠界後台', icon: 'link' }
      },
      {
        path: 'https://portal.tappaysdk.com/login',
        meta: { title: 'Tappay', icon: 'link' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
  {
    path: '/backend_user',
    component: Layout,
    meta: {
      title: '後台使用者',
      icon: 'users',
      roles: ['admin']
    },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/backend_users/index'),
        meta: { title: '後台使用者管理', icon: 'users', roles: ['admin'] }
      },
      {
        path: 'invoice_to_excel',
        name: 'invoice_to_excel',
        component: () => import('@/views/invoice_to_excel/index'),
        meta: { title: '開立發票Excel', icon: 'form', roles: ['admin'] }
      }]
  }
]
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
