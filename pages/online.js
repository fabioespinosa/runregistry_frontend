import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { CHANGE_WORKSPACE, fetchWorkspaces } from '../ducks/online/workspace';
import { Layout, Breadcrumb } from 'antd';
import { initializeFiltersFromUrl } from '../ducks/online/runs';
import { initializeUser, initializeEnvironment } from '../ducks/info';

import Page from '../layout/page';
import RunTable from '../components/online/run_table/RunTable';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import SignificantRunTable from '../components/online/run_table/SignificantRunTable';
import ManageRunModal from '../components/online/manage_run/ManageRunModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
import ClassifierVisualizationModal from '../components/online/classifier_visualization/ClassifierVisualizationModal';
const { Content } = Layout;

class Online extends Component {
  static getInitialProps({ store, query, isServer }) {
    if (isServer) {
      initializeUser(store, query);
      initializeEnvironment(store);
    }
    // We put the filters from URL in the redux store:
    // initializeFiltersFromUrl({ store, query });
    if (!isServer) {
      store.dispatch({
        type: CHANGE_WORKSPACE,
        payload: query.workspace
      });
    }
  }

  async componentDidMount() {
    const {
      router: { query }
    } = this.props;
    await this.props.fetchWorkspaces(query);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { router } = this.props;
    const {
      router: {
        asPath,
        query: { type, section, workspace, run_filter }
      },
      user
    } = this.props;

    const breadcrumbs = asPath.split('/');
    return (
      <Page router={router} user={user} side_nav={true}>
        <BreadcrumbCmp router={router} online={true}>
          <Breadcrumb.Item>{type || breadcrumbs[0]}</Breadcrumb.Item>
        </BreadcrumbCmp>
        <Content
          style={{
            // background: '#fff',
            padding: 0,
            margin: 0,
            minHeight: 280
          }}
        >
          <ManageRunModal />
          <LumisectionModal />
          <ClassifierVisualizationModal />
          <RunTable defaultPageSize={12} />
          <SignificantRunTable defaultPageSize={5} />
        </Content>
      </Page>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.info
  };
};

export default withRouter(
  connect(mapStateToProps, { fetchWorkspaces, initializeFiltersFromUrl })(
    Online
  )
);
