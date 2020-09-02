import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { CHANGE_WORKSPACE, fetchWorkspaces } from '../ducks/online/workspace';
import { Layout, Breadcrumb, Switch } from 'antd';
import { initializeUser, initializeEnvironment } from '../ducks/info';

import Page from '../layout/page';
import RunTable from '../components/online/run_table/RunTable';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import ManageRunModal from '../components/online/manage_run/ManageRunModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
import ClassifierVisualizationModal from '../components/online/classifier_visualization/ClassifierVisualizationModal';

import { filterRuns } from '../ducks/online/runs';
import { filterRuns as filterSignificantRuns } from '../ducks/online/significant_runs';
import axios from 'axios';
import QueryString from 'qs';
const { Content } = Layout;

let interval;
class Online extends Component {
  constructor(props) {
    super(props);
    this.all_runs_ref = React.createRef();
    this.significant_runs_ref = React.createRef();
  }
  static async getInitialProps({ store, query, isServer }) {
    if (isServer) {
      initializeUser(store, query);
      initializeEnvironment(store);
    }
    if (!isServer) {
      // // Get token info and save it in redux store:
      // const { data } = await axios.get('https://cmsweb-auth.cern.ch/renew', {
      //   headers: {
      //     accept: 'json',
      //   },
      // });
      // const { access_token, expires_in, refresh_token, refresh_expires_in, id_token } = data;

      store.dispatch({
        type: CHANGE_WORKSPACE,
        payload: query.workspace,
      });
    }
  }

  async componentDidMount() {
    const {
      router: { query },
    } = this.props;
    await this.props.fetchWorkspaces(query);
  }

  switchLiveMode = (live_mode) => {
    if (live_mode) {
      interval = setInterval(async () => {
        await Promise.all([
          this.significant_runs_ref.current.refresh(),
          this.all_runs_ref.current.refresh(),
        ]);
      }, 15000);
    }
    if (!live_mode) {
      clearInterval(interval);
    }
  };

  render() {
    const { router } = this.props;
    const {
      router: {
        asPath,
        query: { type, section, workspace, filters },
      },
      user,
      run_table,
      significant_run_table,
      filterRuns,
      filterSignificantRuns,
    } = this.props;
    const breadcrumbs = asPath.split('/');
    return (
      <Page router={router} user={user} side_nav={true}>
        <BreadcrumbCmp
          router={router}
          online={true}
          switchLiveMode={this.switchLiveMode}
        >
          <Breadcrumb.Item>{type || breadcrumbs[0]}</Breadcrumb.Item>
          <Breadcrumb.Item>{workspace || breadcrumbs[1]}</Breadcrumb.Item>
        </BreadcrumbCmp>
        <Content
          style={{
            // background: '#fff',
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >
          <ManageRunModal />
          <LumisectionModal />
          <ClassifierVisualizationModal />

          <RunTable
            ref={this.all_runs_ref}
            asPath={asPath}
            run_table={run_table}
            filterRuns={filterRuns}
            url_filters={filters}
            defaultPageSize={12}
            // ots for Online Top Sortings
            sorting_prefix_from_url="ots"
            // otf for One Top Filters
            filter_prefix_from_url="otf"
            table_label="All runs "
          />
          <RunTable
            ref={this.significant_runs_ref}
            asPath={asPath}
            run_table={significant_run_table}
            filterRuns={filterSignificantRuns}
            url_filters={filters}
            defaultPageSize={5}
            // obs for Online Bottom Sortings
            sorting_prefix_from_url="obs"
            // obf for Online Bottom Filters
            filter_prefix_from_url="obf"
            table_label="Significant runs "
          />
        </Content>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.info,
    run_table: state.online.runs,
    significant_run_table: state.online.significant_runs,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchWorkspaces,
    filterRuns,
    filterSignificantRuns,
  })(Online)
);
