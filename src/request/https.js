/**axios封装
 * 请求拦截、相应拦截、错误统一处理
 */
import axios from 'axios';
import router from '@/router'

// 环境的切换
if (process.env.NODE_ENV == 'development') { //开发环境
  axios.defaults.baseURL = '/';
} else if (process.env.NODE_ENV == 'debug') {
  axios.defaults.baseURL = '';
} else if (process.env.NODE_ENV == 'production') {
  axios.defaults.baseURL = 'http://10.0.4.160:9091'; //线上地址
}

// 请求超时时间
axios.defaults.timeout = 10000;

// post请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';

//请求拦截
axios.interceptors.request.use((request) => {
  return request;

})
// 响应拦截器
axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      if (response.data.code == 10) {
        //Cookies失效
        setTimeout(() => {
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
        }, 1000);
      }
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况    
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录                
        // 未登录则跳转登录页面，并携带当前页面的路径                
        // 在登录成功后返回当前页面，这一步需要在登录页操作。                
        case 401:
          router.replace({
            path: '/login',
            query: {
              redirect: router.currentRoute.fullPath
            }
          });
          break;
          // 403 token过期                
          // 登录过期对用户进行提示                
          // 清除本地token和清空vuex中token对象                
          // 跳转登录页面                
        case 403:
          console.log('登录过期，请重新登录');
          // 清除token                    
          localStorage.removeItem('token');
          // store.commit('loginSuccess', null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.replace({
              path: '/login',
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 1000);
          break;
          // 404请求不存在                
        case 404:
          console.log('网络请求不存在');
          break;
          // 其他错误，直接抛出错误提示                
        default:
          console.log(error.response.data.message, '错误提示！');
      }
      return Promise.reject(error.response);
    }
  }
);
/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}
/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function postJson(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
        headers: {
          'Content-Type': "application/json"
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/** 
 * post方法，对应post请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function postZip(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
        headers: {
          'Content-Type': 'application/json; application/octet-stream'
        },
        responseType: 'blob'
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/** 
 * post方法，对应post请求，用于传输文件
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function postFile(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params, {
        headers: {
          'session': "",
          'Content-Type': "multipart/form-data"
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data)
      })
  });
}

/** 
 * put方法，对应put请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios.put(url, params, {
        headers: {
          'Content-Type': "application/json"
        }
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(res => {
        reject(res.data);
      })
  })
}

/** 
 * * 参数放在路径里面
 * delete方法，对应delete请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function del(url, params) {
  return new Promise((resolve, reject) => {
    axios.delete(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(res => {
        reject(res.data);
      })
  })
}

/** 
 * delete方法，所传参数在请求体中
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export async function $del(url, obj = {}) {
  return await axios({
    method: 'delete',
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    transformRequest: [
      function (data) {
        return data
      }
    ],
    data: JSON.stringify(obj)
  }).then(res => {
    return res.data
  })
}