const {
  setupComponent,
  checkWrap,
  checkWrapActions,
  initialState,
  translators,
  terms,
  languages,
  appPath
} = require('../_shared.js');

const Edit = require(appPath + 'components/Edit').default;

describe('Testing Edit Component.', () => {

  beforeEach(() => console.log = jest.fn());

  const responseFail = {
    message: 'Some error. Database error'
  };

  const checkShowEdit = (translatorId, term, started, pending, error) => {
    languages.forEach(lang => {
      const _initialState = { ...initialState,
        common: { ...initialState.common,
          userLanguage: lang.id
        },
        edit: { ...initialState.edit,
          started,
          pending,
          error,
          termId: term ? term.id : null,
          translatorId,
          source: term ? term.translations[0] : null,
          change: term ? term.translations[0] : null
        }
      }
      const query = {
        translatorId,
        termId: term ? term.id : null
      };
      const _props = {
        location: {
          pathname: '/edit',
          query
        },
        query
      };
      const {wrapper} = setupComponent(Edit, _initialState, _props);
      const i18n = require(appPath + 'i18n/' + lang.id);

      checkWrap(wrapper.find('[data-test-id="Edit"]'));

      checkWrap(wrapper.find('[data-test-id="back-link"]'), {
        text: i18n['Edit.go_back'],
        className: 'back-link'
      });

      if (!translatorId || (!term || !term.id)) {
        checkWrap(wrapper.find('[data-test-id="blockMessage"]'), {
          text: i18n['Edit.should_select_term']
        })
      } else {
        checkWrap(wrapper.find('[data-test-id="blockMessage"]'), {
          length: 0
        })
      }

      if (pending) {
        checkWrap(wrapper.find('[data-test-id="pending"]'), {
          text: i18n['Edit.query_is_performed']
        })
      } else {
        checkWrap(wrapper.find('[data-test-id="pending"]'), {
          length: 0
        })
      }

      if (error) {
        checkWrap(wrapper.find('[data-test-id="request_error"]'), {
          text: i18n['Edit.request_error'] + responseFail.message
        });
        checkWrap(wrapper.find('[data-test-id="errorMsg"]'), {
          text: responseFail.message,
          className: 'error'
        });
      } else {
        checkWrap(wrapper.find('[data-test-id="request_error"]'), {
          length: 0
        })
      }

      if (started && translatorId && term && term.id && !pending && !error) {
        checkWrap(wrapper.find('[data-test-id="Meanings"]'))
        // further tests in "test/frontend/components/edit/Meanings"
      }

      wrapper.unmount();
    });
  };

  const defaultTerm = terms[0];
  const defaultTranslator = translators[0];

  it('should show component sending request',
    () => checkShowEdit(defaultTranslator.id, defaultTerm, true, true, null)
  );

  it('should show component showing the error',
    () => checkShowEdit(defaultTranslator.id, defaultTerm, true, false, responseFail)
  );

  it('should show component showing block message (no termId)',
    () => checkShowEdit(null, defaultTerm, true, false, null)
  );

  it('should show component showing block message (no translatorId)',
    () => checkShowEdit(defaultTranslator.id, null, true, false, null)
  );

  it('should show component with no data and no request',
    () => checkShowEdit(defaultTranslator.id, defaultTerm, false, false, null)
  );

  translators.forEach(translator =>
    it('should show component with data',
      () => checkShowEdit(translator.id, defaultTerm, true, false, null)
    )
  );

  it('should correctly handle actions on component (with valid props.query)', () => {
    const query = {
      translatorId: 'TRANSLATOR_ID',
      termId: 'TERM_ID'
    };
    const _props = {
      location: {
        pathname: '/edit',
        query
      },
      query,
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(Edit, initialState, _props);

    let actionsCount = 1;  // component starts with the request
    checkWrapActions(store, actionsCount);

    // wrapper.find('[data-test-id="back-link"]').props().onClick();  // SecurityError ???
    // checkWrapActions(store, ++actionsCount);
  });

  it('should correctly handle actions on component (with invalid props.query)', () => {
    const query = {
      translatorId: 'TRANSLATOR_ID'
    };
    const _props = {
      location: {
        pathname: '/edit',
        query
      },
      query,
      dispatch: jest.fn()
    };
    const {wrapper, store} = setupComponent(Edit, initialState, _props);

    let actionsCount = 0;  // component doesn't send request, because query invalid
    checkWrapActions(store, actionsCount);

    // wrapper.find('[data-test-id="back-link"]').props().onClick();  // SecurityError ???
    // checkWrapActions(store, ++actionsCount);
  });
});
