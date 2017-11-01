global.window.localStorage = {};
const {expect} = require('chai');

const EditUser = require('../../../../app/components/admin/EditUser').default;
const {getEditableUserDataObject} = require('../../../../app/actions/admin/changeUser');
const {setupComponent, checkWrap, initialState, languages, translators} = require('../../_shared.js');

describe('Testing EditUser Component.', () => {

  const checkShowEditUser = (sourcePending, pending, error, translator, lang) => {
    const _initialState = { ...initialState,
      common: { ...initialState.common,
        userLanguage: lang,
        languages
      },
      admin: { ...initialState.admin,
        editUser: { ...initialState.admin.editUser,
          id: translator.id,
          dataSource: getEditableUserDataObject(translator),
          data: getEditableUserDataObject(translator),
          pending,
          sourcePending,
          error
        }
      }
    };
    const _props = {
      params: {
        id: translator.id
      },
      routeParams: {
        id: translator.id
      }
    };
    const wrapper = setupComponent(EditUser, _initialState, _props);
    const i18n = require('../../../../app/i18n/' + lang);

    if (sourcePending) {
      checkWrap(wrapper.find('[data-test-id="EditUser"]'), {
        length: 0
      });
      wrapper.unmount();
      return
    }

    checkWrap(wrapper.find('[data-test-id="EditUser"]'));

    checkWrap(wrapper.find('[data-test-id="main-form"]'), {
      className: 'col-md-6'
    });

    checkWrap(wrapper.find('[data-test-id="heading"]'), {
      text: i18n['EditUser.title_edit_user'].replace(`{id}`, translator.id)
    });

    checkWrap(wrapper.find('[data-test-id="form-name"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('[data-test-id="label-name"]'), {
      text: i18n['EditUser.name_of_translator']
    });

    checkWrap(wrapper.find('[data-test-id="input-name"]'), {
      className: 'form-control',
      value: translator.name,
      type: 'text'
    });

    checkWrap(wrapper.find('[data-test-id="form-lang"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('[data-test-id="label-lang"]'), {
      text: i18n['EditUser.language_of_translations']
    });

    languages.forEach((language, languageIndex) => {

      checkWrap(wrapper.find('[data-test-id="radio-lang"]').at(languageIndex), {
        className: 'radio'
      });

      checkWrap(wrapper.find('[data-test-id="radio-label-lang"]').at(languageIndex));

      checkWrap(wrapper.find('[data-test-id="input-lang"]').at(languageIndex), {
        checked: language.id === translator.language,
        text: language['name_' + lang.id],
        name: 'lang_radio',
        type: 'radio'
      });
    });

    checkWrap(wrapper.find('[data-test-id="form-desc"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('[data-test-id="label-desc"]'), {
      text: i18n['EditUser.description_of_translator']
    });

    checkWrap(wrapper.find('[data-test-id="textarea-desc"]'), {
      value: translator.description,
      className: 'form-control',
      type: 'text'
    });

    checkWrap(wrapper.find('[data-test-id="button-group"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('[data-test-id="button-save"]'), {
      text: i18n['EditUser.button_save'],
      className: 'btn btn-primary',
      disabled: pending
    });

    checkWrap(wrapper.find('[data-test-id="button-reset"]'), {
      text: i18n['EditUser.button_reset_changes'],
      className: 'btn btn-default'
    });

    checkWrap(wrapper.find('a[data-test-id="button-cancel"]'), {
      text: i18n['EditUser.button_cancel']
    });

    checkWrap(wrapper.find('[data-test-id="password-group"]'), {
      className: 'form-group'
    });

    checkWrap(wrapper.find('a[data-test-id="link-password"]'), {
      text: i18n['EditUser.link_reset_password']
    });

    wrapper.unmount();
  };

  translators.forEach(translator =>
    languages.forEach(lang => {
      it(`should show the source pending component correctly`,
        () => checkShowEditUser(true, false, null, translator, lang.id)
      );
      it(`should show the component correctly`,
        () => checkShowEditUser(false, false, null, translator, lang.id)
      );
      it(`should show the pending component correctly`,
        () => checkShowEditUser(false, true, null, translator, lang.id)
      );
      it(`should show the component with fail request`,
        () => checkShowEditUser(false, true, 'Error message', translator, lang.id)
      );
    })
  );
});