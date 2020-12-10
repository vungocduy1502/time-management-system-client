import Vue from 'vue'
import Cookies from 'js-cookie'

export default function ({ redirect, route }) {
  const $authInfo = Vue.prototype.$authInfo
  const allowRoles = [3]
  if (!$authInfo.checkAuth()) {
    return redirect({
      name: 'login',
      query: { continue: route.fullPath },
    })
  }
  if (allowRoles.indexOf($authInfo.role()) == -1) {
    Cookies.remove('access_token')
    Cookies.remove('role_permission')
    $authInfo.logoutAction()
    return redirect({
      name: 'login',
      query: { continue: route.fullPath },
    })
  }
}
