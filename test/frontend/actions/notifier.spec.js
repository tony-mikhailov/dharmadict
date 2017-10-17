const configureMockStore = require('redux-mock-store').default;
const thunk = require('redux-thunk').default;
const expect = require('expect');

const {initialState, cloneState, getNotificationAction} = require('../_shared.js');

const actions = require('../../../app/actions/notifier');
const {defaultNotification} = require('../../../app/actions/notifier');
const types = require('../../../app/actions/_constants');
const reducer = require('../../../app/reducers').default;

let middlewares = [thunk];
let mockStore = configureMockStore(middlewares);

describe('common actions', () => {
  beforeEach(() => {
    console.log = jest.fn();
  });

  it('should return the initial state', () => {
    expect(reducer()).toEqual(initialState);
  });

  const createNotification = (notification, idLast) => ({
    id: idLast || 1,
    type: notification.type || defaultNotification.type,
    ttl: notification.ttl || defaultNotification.ttl,
    text: notification.text,
    values: notification.values || {}
  });

  describe('function notify', () => {
    const expectedAction = (notification, idLast) => ({
      type: 'CREATE_NOTIFICATION',
      idLast: idLast || 1,
      notification: createNotification(notification, idLast)
    });
    const testFunctionNotify = (notification) => {

      let expectedState = cloneState();
      Object.assign(expectedState.notifications, {
        idLast: 1,
        list: [...expectedState.notifications.list, expectedAction(notification).notification]
      });

      it('should work, reducer', () =>
        // test types.CREATE_NOTIFICATION
        expect(reducer(initialState, expectedAction(notification))).toEqual(expectedState)
      );

      it('should work, action', () => {
        const store = mockStore(initialState);
        store.dispatch(actions.notify(notification));
        delete store.getActions()[0].notification.timer;
        expect(store.getActions()[0]).toEqual(expectedAction(notification));
      });
    };

    // notification can contain 'type', 'ttl', 'text', 'values'
    testFunctionNotify({type: 'success', ttl: 2300, text: 'some text!', values: {idForMessage: 'ID'}});
    testFunctionNotify({type: 'default', ttl: 2300, text: 'some new text!'});
    testFunctionNotify({type: 'danger', ttl: 3000, text: 'some new new text!'});
    testFunctionNotify({type: 'success', text: 'some text!'});
    testFunctionNotify({});
  });

  describe('function removeNotify', () => {
    const expectedAction = (notifications) => ({
      type: 'REMOVE_NOTIFICATION',
      notifications
    });
    const testFunctionRemoveNotify = (id, force) => {
      let _initialState = cloneState();
      for (let i = 0; i < 10; i++) {
        Object.assign(_initialState.notifications, {
          idLast: i + 1,
          list: [..._initialState.notifications.list,
            createNotification({type: 'success', text: 'some text!'}, i + 1)
          ]
        })
      }

      let expectedState = cloneState();
      Object.assign(expectedState.notifications, {..._initialState.notifications,
        list: _initialState.notifications.list.filter(elem => {
          if(elem.id !== id) {
            return true
          }
          if(force) {
            clearTimeout(elem.timer)
          }
        })
      })

      it('should work, reducer', () =>
        // test types.REMOVE_NOTIFICATION
        expect(reducer(_initialState, expectedAction(expectedState.notifications.list))).toEqual(expectedState)
      );

      it('should work, action', () => {
        const store = mockStore(_initialState);
        store.dispatch(actions.removeNotify(id));
        expect(store.getActions()[0]).toEqual(expectedAction(expectedState.notifications.list));
      });
    };

    testFunctionRemoveNotify(4, false);
    testFunctionRemoveNotify(5, true);
    testFunctionRemoveNotify(6, false);
    testFunctionRemoveNotify(7, true);
  });
})
