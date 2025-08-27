import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior() {
    return { x: 0, y: 0 }
  },
  routes: [
    {
      path: '/',
      name: '/',
      component: () => import('@/views/dashboard/index.vue'),
      meta: {
        pageTitle: 'Dashboard',
        breadcrumb: [
          {
            text: 'Dashboard',
            active: true,
          },
        ],
      },
    },
    {
      path: '/second-page',
      name: 'second-page',
      component: () => import('@/views/SecondPage.vue'),
      meta: {
        pageTitle: 'Second Page',
        breadcrumb: [
          {
            text: 'Second Page',
            active: true,
          },
        ],
      },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/Auth/Login.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('@/views/Auth/ForgotPassword.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('@/views/Auth/ResetPassword.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: () => import('@/views/admin/index.vue'),
      meta: {
        pageTitle: 'المدراء',
        breadcrumb: [{
          text: 'المدراء',
          active: true,
        }],
      },
    },
    {
      path: '/partner-person-contact',
      name: 'partner-person-contact',
      component: () => import('@/views/PartnerPersonContact/index.vue'),
      meta: {
        pageTitle: 'شخص الاتصال',
        breadcrumb: [{
          text: 'شخص الاتصال',
          active: true,
        }],
      },
    },
    {
      path: '/partner-person-contact/indexByPartner/:id',
      name: 'partner-person-contact-indexByPartner',
      component: () => import('@/views/PartnerPersonContact/indexByPartner.vue'),
      meta: {
        pageTitle: 'شخص الاتصال',
        breadcrumb: [{
          text: 'شخص الاتصال',
          active: true,
        }],
      },
    },
    {
      path: '/partner',
      name: 'partner',
      component: () => import('@/views/partner/index.vue'),
      meta: {
        pageTitle: 'العملاء',
        breadcrumb: [{
          text: 'العملاء',
          active: true,
        }],
      },
    },
    {
      path: '/partner/:partnerId/admins',
      name: 'partner-admins',
      component: () => import('@/views/partner/admin/index.vue'),
      meta: {
        pageTitle: 'Partner Admins',
        breadcrumb: [
          {
            text: 'Partners',
            to: { name: 'partner' },
          },
          {
            text: 'Admins',
            active: true,
          },
        ],
        navActiveLink: 'partner',
      },
    },
    {
      path: '/catalog/',
      name: 'catalog',
      component: () => import('@/views/catalog/index.vue'),
      meta: {
        pageTitle: 'Catalog',
        breadcrumb: [{
          text: 'Catalog',
          active: true,
        }],
      },
    },
    {
      path: '/catalog-details/:id',
      name: 'catalog-details',
      component: () => import('@/views/catalog/details.vue'),
      meta: {
        pageTitle: 'Catalog',
        breadcrumb: [
          {
            text: 'Details',
            active: true,
          },
        ],
        navActiveLink: 'catalog',
      },
    },
    {
      path: '/partnercatalog',
      name: 'partnercatalog',
      component: () => import('@/views/partnerCatalog/index.vue'),
      meta: {
        pageTitle: 'Partner Catalog',
        breadcrumb: [{
          text: 'Partner Catalog',
          active: true,
        }],
      },
    },

    

    {
      path: '/partnerCatalogDetails/:product_id',
      name: 'partnerCatalogDetails',
      component: () => import('@/views/partnerCatalog/details.vue'),
    },

    {
      path: '/order-report',
      name: 'order-report',
      component: () => import('@/views/orderReport/index.vue'),
      meta: {
        pageTitle: 'Order Report',
        breadcrumb: [{
          text: 'Order Report',
          active: true,
        }],
      },
    },
    {
      path: '/order-report/:requestId',
      name: 'order-report-details',
      component: () => import('@/views/orderReport/details.vue'),
      meta: {
        pageTitle: 'Order Details',
        breadcrumb: [
          {
            text: 'Order Report',
            to: { name: 'order-report' },
          },
          {
            text: 'Details',
            active: true,
          },
        ],
        navActiveLink: 'order-report',
      },
    },

    {
      path: '/wallet',
      name: 'wallet',
      component: () => import('@/views/wallet/index.vue'),
      meta: {
        pageTitle: 'Wallets',
        breadcrumb: [
          {
            text: 'Wallets',
            active: true,
          },
        ],
      },
    },
    {
      path: '/wallet/:walletNumber/history',
      name: 'wallet-history',
      component: () => import('@/views/wallet/history.vue'),
      meta: {
        pageTitle: 'Wallet History',
        breadcrumb: [
          {
            text: 'Wallets',
            to: { name: 'wallet' },
          },
          {
            text: 'History',
            active: true,
          },
        ],
      },
    },
    {
      path: '/error-404',
      name: 'error-404',
      component: () => import('@/views/error/Error404.vue'),
      meta: {
        layout: 'full',
      },
    },
    {
      path: '*',
      redirect: 'error-404',
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.meta.pageTitle) {
    document.title = ` ${process.env.VUE_APP_NAME} || ${to.meta.pageTitle}`
  }

  const token = $cookies.get(process.env.VUE_APP_NAME + '_AUTH_TOKEN')
  // If logged in, or going to the Login page.
  if (token || to.name === 'login' || to.name === 'forgot-password' || to.name === 'reset-password') {
    // Continue to page.
    next()
  } else {
    // Not logged in, redirect to login.
    next({ name: 'login' })
  }
})

// ? For splash screen
// Remove afterEach hook if you are not using splash screen
router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
  if (appLoading) {
    appLoading.style.display = 'none'
  }
})

export default router
