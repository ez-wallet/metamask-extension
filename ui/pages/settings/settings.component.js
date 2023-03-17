import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, matchPath } from 'react-router-dom';
import classnames from 'classnames';
import TabBar from '../../components/app/tab-bar';

import {
  ALERTS_ROUTE,
  ADVANCED_ROUTE,
  SECURITY_ROUTE,
  GENERAL_ROUTE,
  ABOUT_US_ROUTE,
  SETTINGS_ROUTE,
  NETWORKS_ROUTE,
  ///: BEGIN:ONLY_INCLUDE_IN(flask)
  SNAPS_VIEW_ROUTE,
  SNAPS_LIST_ROUTE,
  ///: END:ONLY_INCLUDE_IN
  CONTACT_LIST_ROUTE,
  CONTACT_ADD_ROUTE,
  CONTACT_EDIT_ROUTE,
  CONTACT_VIEW_ROUTE,
  EXPERIMENTAL_ROUTE,
  ADD_NETWORK_ROUTE,
  ADD_POPULAR_CUSTOM_NETWORK,
} from '../../helpers/constants/routes';

// import { getSettingsRoutes } from '../../helpers/utils/settings-search';
import AddNetwork from '../../components/app/add-network/add-network';
import {
  Icon,
  // ButtonIcon,
  // ICON_SIZES,
  ICON_NAMES,
} from '../../components/component-library';
// import { Color } from '../../helpers/constants/design-system';
import SettingsTab from './settings-tab';
import AlertsTab from './alerts-tab';
import NetworksTab from './networks-tab';
import AdvancedTab from './advanced-tab';
import InfoTab from './info-tab';
import SecurityTab from './security-tab';
import ContactListTab from './contact-list-tab';
import ExperimentalTab from './experimental-tab';
///: BEGIN:ONLY_INCLUDE_IN(flask)
import SnapListTab from './flask/snaps-list-tab';
import ViewSnap from './flask/view-snap';
///: END:ONLY_INCLUDE_IN
// import SettingsSearch from './settings-search';
// import SettingsSearchList from './settings-search-list';

class SettingsPage extends PureComponent {
  static propTypes = {
    addNewNetwork: PropTypes.bool,
    addressName: PropTypes.string,
    backRoute: PropTypes.string,
    breadCrumbTextKey: PropTypes.string,
    conversionDate: PropTypes.number,
    currentPath: PropTypes.string,
    history: PropTypes.object,
    initialBreadCrumbKey: PropTypes.string,
    initialBreadCrumbRoute: PropTypes.string,
    isAddressEntryPage: PropTypes.bool,
    isPopup: PropTypes.bool,
    isSnapViewPage: PropTypes.bool,
    mostRecentOverviewPage: PropTypes.string.isRequired,
    pathnameI18nKey: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  state = {
    // isSearchList: false,
    lastFetchedConversionDate: null,
    // searchResults: [],
    // searchText: '',
  };

  shouldRenderExperimentalTab =
    process.env.TRANSACTION_SECURITY_PROVIDER || process.env.NFTS_V1;

  componentDidMount() {
    this.handleConversionDate();
  }

  componentDidUpdate() {
    this.handleConversionDate();
  }

  handleConversionDate() {
    const { conversionDate } = this.props;
    if (conversionDate !== null) {
      this.setState({ lastFetchedConversionDate: conversionDate });
    }
  }

  handleClickSetting(setting) {
    const { history } = this.props;
    history.push(setting.route);
    this.setState({
      // isSearchList: '',
      // searchResults: '',
    });
  }

  render() {
    const {
      history,
      backRoute,
      currentPath,
      mostRecentOverviewPage,
      addNewNetwork,
      // isSnapViewPage,
    } = this.props;

    // const { searchResults, isSearchList, searchText } = this.state;
    // const { t } = this.context;

    return (
      <div
        className={classnames('w-full', {
          'settings-page--selected': currentPath !== SETTINGS_ROUTE,
        })}
      >
        <div className="w-full px-4">
          <div className="settings-page__header__title-container">
            {currentPath !== SETTINGS_ROUTE && (
              <div className="h-[48px] w-[68px] bg-grey-6 rounded-[50px] shadow-neumorphic flex items-center justify-center">
                <Icon
                  size="sm"
                  name={ICON_NAMES.ARROW_LEFT}
                  onClick={() => history.push(backRoute)}
                />
              </div>
            )}
            {currentPath === SETTINGS_ROUTE && (
              <div className="h-[48px] w-[68px] " />
            )}
            {this.renderTitle()}
            <div className="h-[48px] w-[68px] bg-grey-6 rounded-[50px] shadow-neumorphic flex items-center justify-center">
              <Icon
                name="close"
                size="sm"
                onClick={() => {
                  if (addNewNetwork) {
                    history.push(NETWORKS_ROUTE);
                  } else {
                    history.push(mostRecentOverviewPage);
                  }
                }}
              />
            </div>
          </div>

          {/* <div className="settings-page__header__search">
            <SettingsSearch
              onSearch={({ searchQuery = '', results = [] }) => {
                this.setState({
                  isSearchList: searchQuery !== '',
                  searchResults: results,
                  searchText: searchQuery,
                });
              }}
              settingsRoutesList={getSettingsRoutes()}
            />
            {isSearchList && searchText.length >= 3 && (
              <SettingsSearchList
                results={searchResults}
                onClickSetting={(setting) => this.handleClickSetting(setting)}
              />
            )}
          </div> */}
        </div>

        <div className="settings-page__content px-4">
          {currentPath === SETTINGS_ROUTE && (
            <div className="settings-page__content__tabs">
              {this.renderTabs()}
            </div>
          )}
          {currentPath !== SETTINGS_ROUTE && (
            <div className="settings-page__content__modules">
              {/* {isSnapViewPage ? null : this.renderSubHeader()} */}
              {this.renderContent()}
            </div>
          )}
        </div>
      </div>
    );
  }

  renderTitle() {
    const { t } = this.context;
    const { isPopup, pathnameI18nKey, addressName, isSnapViewPage } =
      this.props;
    let titleText;
    if (isSnapViewPage) {
      titleText = t('snaps');
    } else if (isPopup && addressName) {
      titleText = t('details');
    } else if (pathnameI18nKey && isPopup) {
      titleText = t(pathnameI18nKey);
    } else if (pathnameI18nKey) {
      titleText = t(pathnameI18nKey);
    } else {
      titleText = t('settings');
    }

    return (
      <div className="flex-grow text-center text-[19px] font-bold text-black">
        {titleText}
      </div>
    );
  }

  renderSubHeader() {
    const { t } = this.context;
    const {
      currentPath,
      isPopup,
      isAddressEntryPage,
      pathnameI18nKey,
      addressName,
      initialBreadCrumbRoute,
      breadCrumbTextKey,
      history,
      initialBreadCrumbKey,
    } = this.props;

    let subheaderText;

    if (isPopup && isAddressEntryPage) {
      subheaderText = t('settings');
    } else if (isAddressEntryPage) {
      subheaderText = t('contacts');
    } else if (initialBreadCrumbKey) {
      subheaderText = t(initialBreadCrumbKey);
    } else {
      subheaderText = t(pathnameI18nKey || 'general');
    }

    return (
      !currentPath.startsWith(NETWORKS_ROUTE) && (
        <div className="settings-page__subheader">
          <div
            className={classnames({
              'settings-page__subheader--link': initialBreadCrumbRoute,
            })}
            onClick={() =>
              initialBreadCrumbRoute && history.push(initialBreadCrumbRoute)
            }
          >
            {subheaderText}
          </div>
          {breadCrumbTextKey && (
            <div className="settings-page__subheader--break">
              <span>{' > '}</span>
              {t(breadCrumbTextKey)}
            </div>
          )}
          {isAddressEntryPage && (
            <div className="settings-page__subheader--break">
              <span>{' > '}</span>
              {addressName}
            </div>
          )}
        </div>
      )
    );
  }

  renderTabs() {
    const { history, currentPath } = this.props;
    const { t } = this.context;
    const tabs = [
      {
        content: t('general'),
        icon: <Icon name="setting" />,
        key: GENERAL_ROUTE,
      },
      {
        content: t('advanced'),
        icon: <Icon name="messages" />,
        key: ADVANCED_ROUTE,
      },

      ///: BEGIN:ONLY_INCLUDE_IN(flask)
      // {
      //   content: t('snaps'),
      //   icon: (
      //     <i className="fa fa-flask" title={t('snapsSettingsDescription')} />
      //   ),
      //   key: SNAPS_LIST_ROUTE,
      // },
      ///: END:ONLY_INCLUDE_IN
      {
        content: t('securityAndPrivacy'),
        icon: <Icon name="lock" />,
        key: SECURITY_ROUTE,
      },
      {
        content: t('contacts'),
        icon: <Icon name="call-received" />,
        key: CONTACT_LIST_ROUTE,
      },
      // {
      //   content: t('alerts'),
      //   icon: <Icon name={ICON_NAMES.NOTIFICATION} />,
      //   key: ALERTS_ROUTE,
      // },
      {
        content: t('networks'),
        icon: <Icon name="cloud-connection" />,
        key: NETWORKS_ROUTE,
      },
    ];

    // if (this.shouldRenderExperimentalTab) {
    //   tabs.push({
    //     content: t('experimental'),
    //     icon: <i className="fa fa-flask" />,
    //     key: EXPERIMENTAL_ROUTE,
    //   });
    // }

    // tabs.push({
    //   content: t('about'),
    //   icon: <i className="fa fa-info-circle" />,
    //   key: ABOUT_US_ROUTE,
    // });

    return (
      <TabBar
        tabs={tabs}
        isActive={(key) => {
          if (key === GENERAL_ROUTE && currentPath === SETTINGS_ROUTE) {
            return true;
          }
          return matchPath(currentPath, { exact: true, path: key });
        }}
        onSelect={(key) => history.push(key)}
      />
    );
  }

  renderContent() {
    return (
      <Switch>
        <Route
          exact
          path={GENERAL_ROUTE}
          render={(routeProps) => (
            <SettingsTab
              {...routeProps}
              lastFetchedConversionDate={this.state.lastFetchedConversionDate}
            />
          )}
        />
        <Route exact path={ABOUT_US_ROUTE} component={InfoTab} />
        <Route exact path={ADVANCED_ROUTE} component={AdvancedTab} />
        <Route exact path={ALERTS_ROUTE} component={AlertsTab} />
        <Route
          exact
          path={ADD_NETWORK_ROUTE}
          render={() => <NetworksTab addNewNetwork />}
        />
        <Route
          exact
          path={NETWORKS_ROUTE}
          render={() => <NetworksTab addNewNetwork={false} />}
        />
        <Route
          exact
          path={ADD_POPULAR_CUSTOM_NETWORK}
          render={() => <AddNetwork />}
        />
        <Route exact path={SECURITY_ROUTE} component={SecurityTab} />
        {this.shouldRenderExperimentalTab ? (
          <Route exact path={EXPERIMENTAL_ROUTE} component={ExperimentalTab} />
        ) : null}
        <Route exact path={CONTACT_LIST_ROUTE} component={ContactListTab} />
        <Route exact path={CONTACT_ADD_ROUTE} component={ContactListTab} />
        <Route
          exact
          path={`${CONTACT_EDIT_ROUTE}/:id`}
          component={ContactListTab}
        />
        <Route
          exact
          path={`${CONTACT_VIEW_ROUTE}/:id`}
          component={ContactListTab}
        />
        {
          ///: BEGIN:ONLY_INCLUDE_IN(flask)
          <Route exact path={SNAPS_LIST_ROUTE} component={SnapListTab} />
          ///: END:ONLY_INCLUDE_IN
        }
        {
          ///: BEGIN:ONLY_INCLUDE_IN(flask)
          <Route exact path={`${SNAPS_VIEW_ROUTE}/:id`} component={ViewSnap} />
          ///: END:ONLY_INCLUDE_IN
        }
        <Route
          render={(routeProps) => (
            <SettingsTab
              {...routeProps}
              lastFetchedConversionDate={this.state.lastFetchedConversionDate}
            />
          )}
        />
      </Switch>
    );
  }
}

export default SettingsPage;
