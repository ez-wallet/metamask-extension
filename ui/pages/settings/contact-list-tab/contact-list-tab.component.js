import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContactList from '../../../components/app/contact-list';
import {
  CONTACT_ADD_ROUTE,
  CONTACT_VIEW_ROUTE,
  CONTACT_LIST_ROUTE,
} from '../../../helpers/constants/routes';
import Button from '../../../components/ui/button';
import {
  getNumberOfSettingsInSection,
  handleSettingsRefs,
} from '../../../helpers/utils/settings-search';
import EditContact from './edit-contact';
import AddContact from './add-contact';
import ViewContact from './view-contact';

export default class ContactListTab extends Component {
  static contextTypes = {
    t: PropTypes.func,
  };

  static propTypes = {
    addressBook: PropTypes.array,
    history: PropTypes.object,
    selectedAddress: PropTypes.string,
    viewingContact: PropTypes.bool,
    editingContact: PropTypes.bool,
    addingContact: PropTypes.bool,
    showContactContent: PropTypes.bool,
    hideAddressBook: PropTypes.bool,
  };

  settingsRefs = Array(
    getNumberOfSettingsInSection(this.context.t, this.context.t('contacts')),
  )
    .fill(undefined)
    .map(() => {
      return React.createRef();
    });

  componentDidUpdate() {
    const { t } = this.context;
    handleSettingsRefs(t, t('contacts'), this.settingsRefs);
  }

  componentDidMount() {
    const { t } = this.context;
    handleSettingsRefs(t, t('contacts'), this.settingsRefs);
  }

  renderAddresses() {
    const { addressBook, history, selectedAddress } = this.props;
    const contacts = addressBook.filter(({ name }) => Boolean(name));
    const nonContacts = addressBook.filter(({ name }) => !name);
    const { t } = this.context;

    if (addressBook.length) {
      return (
        <div>
          <ContactList
            searchForContacts={() => contacts}
            searchForRecents={() => nonContacts}
            selectRecipient={(address) => {
              history.push(`${CONTACT_VIEW_ROUTE}/${address}`);
            }}
            selectedAddress={selectedAddress}
          />
        </div>
      );
    }
    return (
      <div className="w-full p-4 rounded-xl shadow-neumorphic flex flex-col gap-4">
        <div>
          <img className="w-full" alt="contact" src="./images/contact.svg" />
          {/* <h4 className="address-book__title">{t('buildContactList')}</h4> */}

          <Button
            type="primary"
            large
            onClick={() => {
              history.push(CONTACT_ADD_ROUTE);
            }}
          >
            {t('addContact')}
          </Button>
        </div>
      </div>
    );
  }

  renderAddButton() {
    const { history, viewingContact, editingContact } = this.props;

    return (
      <Button
        large
        type="primary"
        className={classnames({
          hidden: viewingContact || editingContact,
        })}
        onClick={() => {
          history.push(CONTACT_ADD_ROUTE);
        }}
      >
        {this.context.t('addContact')}
      </Button>
    );
  }

  renderContactContent() {
    const {
      viewingContact,
      editingContact,
      addingContact,
      showContactContent,
    } = this.props;

    if (!showContactContent) {
      return null;
    }

    let ContactContentComponent = null;
    if (viewingContact) {
      ContactContentComponent = ViewContact;
    } else if (editingContact) {
      ContactContentComponent = EditContact;
    } else if (addingContact) {
      ContactContentComponent = AddContact;
    }

    return ContactContentComponent && <ContactContentComponent />;
  }

  renderAddressBookContent() {
    const { hideAddressBook } = this.props;

    if (!hideAddressBook) {
      return (
        <div ref={this.settingsRefs[0]} className="address-book">
          {this.renderAddresses()}
        </div>
      );
    }
    return null;
  }

  render() {
    const { addingContact, addressBook, history } = this.props;
    return (
      <div className="w-full h-full flex flex-col gap-5">
        {history.location.pathname === CONTACT_LIST_ROUTE
          ? this.renderAddressBookContent()
          : this.renderContactContent()}
        {!addingContact && addressBook.length > 0
          ? this.renderAddButton()
          : null}
      </div>
    );
  }
}
