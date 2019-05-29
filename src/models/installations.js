import moment from 'moment'

const customers = [
  {
    customerId: 'c1',
    customerName: '客户1'
  },
  {
    customerId: 'c2',
    customerName: '客户2'
  }
]

const products = [
  {
    productId: 'p1',
    productName: '产品1'
  },
  {
    productId: 'p2',
    productName: '产品2'
  }
]

const defaultStatus = [
  {
    id: '0',
    label: '未开始'
  },
  {
    id: '1',
    label: '进行中'
  },
  {
    id: '2',
    label: '已完成'
  }
]

const defaultInstallation = {
  installTime: '',
  installNumber: null,
  status: defaultStatus[0].id,
  customerId: '',
  productId: '',
  installId: ''
}

export default {
  namespace: 'installations',
  state: {
    allList: [],
    list: [],
    total: 0,
    timeRange: [],
    customers: [],
    customerId: '',
    products: [],
    productId: '',
    loading: false,
    current: null,
    currentItem: {},
    editorVisible: false,
    editorType: 'create',
    breadcrumbItems: [
      ['/', '首页'],
      ['/installations', '安装']
    ],
    installation: {...defaultInstallation},
    defaultStatusList: defaultStatus,
    disabled: false
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen(location => {
        if (location.pathname === '/installations') {
          dispatch({
            type: 'query',
            payload: location.query
          })
          dispatch({
            type: 'getCustomers'
          })
          dispatch({
            type: "getProducts"
          })
        }
      })
    }
  },
  effects: {
    *query({payload}, {put, select}) {
      const isLogin = yield select(({ systemUser }) => systemUser.isLogin)
      if ( !isLogin ) return
      yield put({ type: 'showLoading' })
      yield put({
        type: 'fetch',
        payload
      })
      yield put({ type: 'hideLoading' })
    },
    *detail({ payload }, { put, select }) {
      const isLogin = yield select(({ systemUser }) => systemUser.isLogin)
      if ( !isLogin ) return
      console.log(payload)
      if (payload.installId === undefined || payload.installId === '') {
        yield put({ type: 'createSuccess', ...payload })
      } else {
        yield put({ type: 'modifySuccess', payload })
      }
      yield put({ type: 'hideEditor' })
      yield put({ type: 'fetch'})
    },
    *getDetail({ payload }, { put, select }) {
      const isLogin = yield select(({ systemUser }) => systemUser.isLogin)
      if ( !isLogin ) return
      yield put({ type: 'fillInstallation', payload })
      yield put({ type: 'showEditor', payload })
    },
    *del({ payload }, { put, select }) {
      const isLogin = yield select(({ systemUser }) => systemUser.isLogin)
      if ( !isLogin ) return
      yield put({ type: 'delSuccess', payload })
      yield put({ type: 'fetch'})
    }
  },
  reducers: {
    fetch(state, action) {
      const payload = action.payload || {}
      const page = payload.page || state.current || 1
      const list = state.allList.slice((page - 1) * 10, 10)
      return {...state, list, ...action.payload}
    },
    getCustomers(state, action) {
      return {...state, customers}
    },
    getProducts(state, action) {
      return {...state, products}
    },
    showLoading(state) {
      return {...state, loading: true}
    },
    hideLoading(state) {
      return {...state, loading: false}
    },
    fillInstallation(state, action) {
      let temp = state.list.filter(item => {
        return item.installId === action.payload.installId
      })
      temp = temp[0] || {}
      temp = Object.assign({}, temp)
      temp.installTime = moment(temp.installTime)
      return {...state, installation: temp}
    },
    showEditor(state, action) {
      const temp = Object.assign({}, state.installation)
      if (!state.installation.installTime) {
        temp.installTime = moment(new Date().getTime())
      }
      let disabled = false
      if (action.payload.type === 'view') {
        disabled = true
      }
      return {...state, editorVisible: true, installation: temp, editorType: action.payload.type, disabled}
    },
    hideEditor(state) {
      const temp = Object.assign({}, defaultInstallation)
      return {...state, editorVisible: false, installation: temp}
    },
    createSuccess(state, action) {
      const temp = Object.assign({}, action)
      temp.installId = new Date().getTime() + '_' + Math.ceil(Math.random() * 10)
      const allList = state.allList.slice()
      allList.push(temp)
      return {...state, allList, total: allList.length}
    },
    modifySuccess(state, action) {
      const temp = Object.assign({}, action.payload)
      const allList = state.allList
      let index = -1
      allList.map((item, i) => {
        if (item.installId === temp.installId) {
          index = i
        }
      })
      if (index !== -1) {
        allList.splice(index, 1, temp)
      }
      return  {...state, allList, total: allList.length}
    },
    delSuccess(state, action) {
      const allList = state.allList.slice()
      let index = -1
      allList.map((item, i) => {
        if (item.installId === action.payload.installId) {
          index = i
        }
      })
      if (index !== -1) {
        allList.splice(index, 1)
        return {...state, allList, total: allList.length}
      }
      return {...state}
    }
  }
}