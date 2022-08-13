import Vue from 'vue'
import Router from 'vue-router'

import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import store from '@/store/index.js'

import { getToken } from '@/utils/auth'
import LoginBySMSPage from '@/Pages/Login/LoginBySMSPage'
import UserInfoPage from '@/Pages/User/UserInfoPage'
import NewsPage from '@/Pages/News/NewsPage'
import NewsDetailPage from '@/Pages/News/NewsDetailPage'
import HistoryPage from '@/Pages/History/HistoryPage'
// import LoginPage from '@/Pages/Login/LoginPage'
import test from '@/Pages/test'
import MainPage from '@/Pages/MainPage'
import RegisterPage from '@/Pages/RegisterPage'
import QrcodePage from '@/Pages/QrcodePage'
import EInvoicePage from '@/Pages/E_InvoicePage'
import CreditCardPage from '@/Pages/CreditCardPage'
import BindCreditCardPage from '@/Pages/BindCreditCardPage'
import AboutPage from '@/Pages/AboutPage'
import RecoverPage from '@/Pages/RecoverPage'

import generateQRCode from '@/Pages/qrcode'

// const LoginBySMSPage = () => import('@/Pages/Login/LoginBySMSPage')
// const UserInfoPage = () => import('@/Pages/User/UserInfoPage')
// const NewsPage = () => import('@/Pages/News/NewsPage')
// const NewsDetailPage = () => import('@/Pages/News/NewsDetailPage')
// const HistoryPage = () => import('@/Pages/History/HistoryPage')
// const LoginPage = () => import('@/Pages/Login/LoginPage')
// const test = () => import('@/Pages/test')
// const MainPage = () => import('@/Pages/MainPage')
// const RegisterPage = () => import('@/Pages/RegisterPage')
// const QrcodePage = () => import('@/Pages/QrcodePage')
// const EInvoicePage = () => import('@/Pages/E_InvoicePage')
// const CreditCardPage = () => import('@/Pages/CreditCardPage')
// const BindCreditCardPage = () => import('@/Pages/BindCreditCardPage') // 验权

Vue.use(Router)

const routerPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return routerPush.call(this, location).catch(error => error)
}

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/test',
      name: 'test',
      // 路由元信息 meta
      meta: {
        breadcrumb: '',
        needAuth: false
      },
      component: test
    },
    {
      path: '/generateQRCode',
      name: 'generateQRCode',
      // 路由元信息 meta
      meta: {
        breadcrumb: '',
        needAuth: false
      },
      component: generateQRCode
    },
    {
      path: '/register',
      name: 'RegisterPage',
      // 路由元信息 meta
      component: RegisterPage,
      needAuth: false
    },
    {
      path: '/',
      name: 'MainPage',
      // 路由元信息 meta
      meta: {
        breadcrumb: '',
        needAuth: true
      },
      component: MainPage
    },
    {
      path: '/loginbysms',
      name: 'LoginBySMSPage',
      meta: {
        breadcrumb: '',
        needAuth: false
      },
      component: LoginBySMSPage
    },
    {
      path: '/userinfo',
      name: 'UserInfoPage',
      meta: {
        breadcrumb: '使用者',
        needAuth: true
      },
      component: UserInfoPage
    },
    {
      path: '/news',
      name: 'NewsPage',
      meta: {
        breadcrumb: '最新消息',
        needAuth: true
      },
      component: NewsPage
    },
    {
      path: '/news/:newsID',
      name: 'NewsDetailPage',
      meta: {
        breadcrumb: '最新消息',
        needAuth: true
      },
      component: NewsDetailPage
    },
    {
      path: '/history',
      name: 'HistoryPage',
      meta: {
        breadcrumb: '消費記錄',
        needAuth: true
      },
      component: HistoryPage
    },
    // {
    //   path: '/login',
    //   name: 'LoginPage',
    //   meta: {
    //     breadcrumb: '',
    //     needAuth: false
    //   },
    //   component: LoginPage
    // },
    {
      path: '/creditcard',
      name: 'CreditCardPage',
      component: CreditCardPage,
      meta: {
        breadcrumb: '信用卡',
        needAuth: true
      }
    },
    {
      path: '/qrcode',
      name: 'QrcodePage',
      component: QrcodePage,
      meta: {
        breadcrumb: 'Qrcode開門',
        needAuth: true
      }
    },
    {
      path: '/invoice',
      name: 'E_InvoicePage',
      component: EInvoicePage,
      meta: {
        breadcrumb: '電子發票設定',
        needAuth: true
      }
    },
    {
      path: '/bindcreditcard',
      name: 'BindCreditCardPage',
      component: BindCreditCardPage,
      meta: {
        breadcrumb: '更換信用卡',
        needAuth: true
      }
    },
    {
      path: '/about',
      name: 'AboutPage',
      component: AboutPage,
      meta: {
        breadcrumb: '關於樂坊',
        needAuth: false
      }
    },
    {
      path: '/recover',
      name: 'RecoverPage',
      component: RecoverPage,
      meta: {
        breadcrumb: '重置安全密碼',
        needAuth: true
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return {
      x: 0,
      y: 0
    }
  }
})

router.beforeEach(async (to, from, next) => {
  //  does the page we want to go to have a meta.progress object
  if (to.meta.progress !== undefined) {
    let meta = to.meta.progress
    // parse meta tags
    NProgress.parseMeta(meta)
  }
  //  start the progress bar
  NProgress.start()
  //  continue to next page
  try {
    if (to.meta.needAuth) {
      if (getToken()) {
        if (!store.getters.userInfo) {
          await store.dispatch('GetInfo')
          next()
        }
      } else {
        next('/loginbysms')
      }
    } else {
      if (getToken()) {
        if (
          to.path === '/loginbysms' ||
          to.path === '/login' ||
          to.path === '/register'
        ) {
          next('/')
        }
      }
    }
    next()
  } catch (err) {
    await store.dispatch('LogFrontendOut')
    next()
  }
})

router.afterEach((to, from) => {
  //  finish the progress bar
  NProgress.done()
})

export default router
