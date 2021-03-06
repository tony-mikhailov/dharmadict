import auth from '../helpers/auth'
import lang from '../helpers/lang'

let initialState = {
  common: {
    userLanguage: '',
    translators: null,
    languages: null
  },
  notifications: {
    idLast: 0,
    list: []
  },
  route: {
    prevLocation: null,
    location: null
  },
  auth: {
    loggedIn: false,
    token: null,
    userInfo: {
      requested: false,
      pending: false,
      promise: null,
      data: null,
      error: null
    },
    modalIsOpen: false,
    login: '',
    password: '',
    pending: false,
    error: null
  },
  pages: {
    list: [],
    pending: false,
    current: {
      page: null,
      pending: false
    }
  },
  terms: {
    list: [],
    pending: false
  },
  search: {
    searchString: '',
    started: false,
    pending: false,
    result: null,
    error: null
  },
  selected: {
    term: null
  },
  edit: {
    started: false,
    termId: '',
    termName: '',
    source: null,
    change: null,
    pending: false,
    error: null,
    update: {
      pending: false,
      error: null
    }
  },
  translatorInfo: {
    pending: false,
    error: null,
    translator: {
      name: '',
      role: '',
      language: '',
      description: ''
    },
    pages: []
  },
  translator: {
    editPassword: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      pending: false,
      error: null
    }
  },
  admin: {
    editPage: {
      url: '',
      author: '',
      dataSource: {
        author: '',
        title: '',
        bio: false,
        text: ''
      },
      data: {
        author: '',
        title: '',
        bio: false,
        text: ''
      },
      noPermission: true,
      sourcePending: false,
      pending: false,
      removePending: false
    },
    newPage: {
      data: {
        url: '',
        bio: false,
        title: '',
        text: ''
      },
      pending: false
    },
    newTerm: {
      wylie: '',
      sanskrit: {},
      termId: null,
      pending: false,
      error: null
    },
    editUser: {
      id: '',
      dataSource: {
        name: '',
        language: ''
      },
      data: {
        name: '',
        language: ''
      },
      sourcePending: false,
      pending: false,
      error: null
    },
    editUserPassword: {
      id: '',
      password: '',
      confirmPassword: '',
      pending: false,
      error: null
    }
  }
}

auth.initialize(initialState.auth)
lang.initialize(initialState.common)

export default initialState
