const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const nock = require('nock');
const expect = require('expect');

const {initialState, cloneState, terms, getNotificationAction} = require('../_shared.js');

const actionsCreators = require('../../../app/actions/search');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('search actions', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.enableNetConnect('localhost');
    console.log = jest.fn();
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  describe('function changeSearchString', () => {
    let newSearchString = 'newSearchString';
    const expectedAction = {
      type: types.CHANGE_SEARCH_STRING,
      newSearchString
    };

    it('should work, reducer', () => {
      let expectedState = cloneState();
      Object.assign(expectedState.search, {searchString: newSearchString});
      expect(reducer(initialState, expectedAction)).toEqual(expectedState);
    });

    it('should work, action', () => {
      let store = mockStore(initialState);
      store.dispatch(actionsCreators.changeSearchString(newSearchString));
      expect(store.getActions()[0]).toEqual(expectedAction);
    });
  });

  describe('function doSearchRequestAsync', () => {
    const searchString = terms[0].wylie;

    const responseSuccess = terms;
    const actions = [
      { type: types.SEARCH_REQUEST_START },
      {
        type: types.SEARCH_REQUEST_END,
        error: null,
        result: terms
      }
    ];
    const states = [
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: true
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          result: terms,
          started: true,
          error: null
        },
        selected: {...initialState.selected,
          term: null
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find terms. Database error'
    };
    const actionsFail = [
      actions[0],
      {
        type: actions[1].type,
        error: responseFail,
        data: null
      },
      getNotificationAction(null, 'SearchInput.request_error')
    ];
    const statesFail = [
      states[0],
      { ...initialState,
        search: { ...initialState.search,
          searchString,
          pending: false,
          started: true,
          result: undefined,
          error: responseFail
        }
      }
    ];

    it('should work, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      expect(reducer(_initialState, actions[0])).toEqual(states[0]);
      expect(reducer(_initialState, actions[1])).toEqual(states[1]);
    });

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get(`/api/terms?pattern=${searchString}`)
        .reply(200, responseSuccess);

      // return store
      //   .dispatch(actionsCreators.doSearchRequestAsync())
      //   .then(() => expect(store.getActions()).toEqual(actions));
    });

    it('should handle error, reducer', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      expect(reducer(_initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(_initialState, actionsFail[1])).toEqual(statesFail[1]);
    });

    it('should handle error, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get('/api/terms?pattern=${searchString}')
        .reply(200, responseFail);

      // return store
      //   .dispatch(actionsCreators.doSearchRequestAsync())
      //   .then(() => expect(store.getActions()).toEqual(actionsFail));
    });
  });

  describe('function selectTermAsync', () => {
    const termId = terms[0].id;
    const term = terms[0].wylie;
    const dataTerm = terms[0];

    const responseSuccess = terms;
    const actions = [
      {
        type: types.CHANGE_SEARCH_STRING,
        newSearchString: term
      },
      { type: types.SEARCH_REQUEST_START },
      {
        type: types.SEARCH_REQUEST_END,
        error: null,
        result: terms
      },
      {
        type: types.SELECT_TERM,
        term: dataTerm
      }
    ];
    const states = [
      { ...initialState,
        search: {
          searchString: term,
          pending: false,
          result: null,
          started: false,
          error: null
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          pending: true
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          pending: false,
          result: terms,
          started: true,
          error: null
        },
        selected: { ...initialState.selected,
          term: null
        }
      },
      { ...initialState,
        search: { ...initialState.search,
          pending: false,
          error: null
        },
        selected: { ...initialState.selected,
          term: dataTerm
        }
      }
    ];

    const responseFail = {
      error: true,
      code: 500,
      message: 'Can\'t find terms. Database error'
    };
    const actionsFail = [
      actions[0],
      actions[1],
      {
        type: actions[2].type,
        error: responseFail,
        data: null
      },
      getNotificationAction(null, 'SearchInput.request_error')
    ];
    const statesFail = [
      states[0],
      states[1],
      { ...initialState,
        search: { ...initialState.search,
          pending: false,
          started: true,
          result: undefined,
          error: responseFail
        }
      }
    ];

    it('should work, reducer', () =>
      actions.forEach((action, i) => expect(reducer(initialState, action)).toEqual(states[i]))
    );

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString: term });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get(`/api/terms?pattern=${term}`)
        .reply(200, responseSuccess);

      return store.dispatch(actionsCreators.selectTermAsync(termId))
        .then(() => {
          expect(store.getActions()[0]).toEqual(actions[0]);
          expect(store.getActions()[1]).toEqual(actions[1]);
          expect(store.getActions()[2]).toEqual(actions[2]);
          expect(store.getActions()[3]).toEqual(actions[3]);
        });
    });

    it('should handle error, reducer', () => {
      expect(reducer(initialState, actionsFail[0])).toEqual(statesFail[0]);
      expect(reducer(initialState, actionsFail[1])).toEqual(statesFail[1]);
      expect(reducer(initialState, actionsFail[2])).toEqual(statesFail[2]);
    });

    it('should handle error, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.search, { searchString: term });
      const store = mockStore(_initialState);

      nock('http://localhost')
        .get('/api/terms?pattern=${term}')
        .reply(200, responseFail);

      // return store
      //   .dispatch(actionsCreators.selectTermAsync(termId))
      //   .then(() => expect(store.getActions()).toEqual(actionsFail));
      // should work
    });
  });

  describe('function selectTerm', () => {

    const term = terms[0].wylie;
    const actions = [
      {
        type: types.SELECT_TERM,
        term
      }
    ];
    const states = [
      { ...initialState,
        selected: { ...initialState.selected,
          term
        }
      }
    ];

    it('should work, reducer', () => {
      expect(reducer(initialState, actions[0])).toEqual(states[0]);
    });

    it('should work, action', () => {
      const store = mockStore(initialState);
      store.dispatch(actionsCreators.selectTerm(term, true));
      expect(store.getActions()).toEqual(actions);
    });
  });

  describe('function toggleComment', () => {

    const term = terms[0];
    const translationIndex = 1;
    const meaningIndex = 1;
    let newTerm = JSON.parse(JSON.stringify(term));
    let meaning = newTerm.translations[translationIndex].meanings[meaningIndex];
    meaning.openComment = !meaning.openComment;

    const actions = [
      {
        type: types.TOGGLE_COMMENT,
        term: newTerm
      }
    ];
    const states = [
      { ...initialState,
        selected: { ...initialState.selected,
          term: newTerm
        }
      }
    ];

    it('should work, reducer', () =>
      expect(reducer(initialState, actions[0])).toEqual(states[0])
    );

    it('should work, action', () => {
      let _initialState = cloneState();
      Object.assign(_initialState.selected, { term });
      const store = mockStore(_initialState);

      store.dispatch(actionsCreators.toggleComment(translationIndex, meaningIndex));
      expect(store.getActions()[0]).toEqual(actions[0]);
    });
  });
})
