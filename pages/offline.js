import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Layout, Breadcrumb, Button } from 'antd';
import { CHANGE_WORKSPACE, fetchWorkspaces } from '../ducks/offline/workspace';
import { initializeUser, initializeEnvironment } from '../ducks/info';

import Page from '../layout/page';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import DatasetTable from '../components/offline/dataset_table/DatasetTable';
import Cycles from '../components/offline/cycles/Cycles';
import ManageDatasetModal from '../components/offline/manage_dataset/ManageDatasetModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
import CycleInfo from '../components/offline/cycles/cycleInfo/CycleInfo';
import {
  filterEditableDatasets,
  filterWaitingDatasets,
} from '../ducks/offline/datasets';

const { Content } = Layout;

class Offline extends Component {
  constructor(props) {
    super(props);
    this.editable_datasets_ref = React.createRef();
    this.cycles_ref = React.createRef();
  }
  static async getInitialProps({ store, query, isServer }) {
    if (isServer) {
      initializeUser(store, query);
      initializeEnvironment(store);
    }
    if (!isServer) {
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

  render() {
    const { router } = this.props;
    const {
      router: {
        asPath,
        query: { type, section, workspace, filters },
      },
      selected_cycle,
      waiting_datasets,
      editable_datasets,
      filterWaitingDatasets,
      filterEditableDatasets,
    } = this.props;
    const breadcrumbs = asPath.split('/');
    return (
      <Page router={router} side_nav>
        <BreadcrumbCmp router={router} online={false}>
          <Breadcrumb.Item>{type || breadcrumbs[0]}</Breadcrumb.Item>
          <Breadcrumb.Item>{section || breadcrumbs[1]}</Breadcrumb.Item>
          <Breadcrumb.Item>{workspace || breadcrumbs[2]}</Breadcrumb.Item>
        </BreadcrumbCmp>
        <Content
          style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >
          <div style={{ display: 'flex' }}>
            {section === 'cycles' && (
              <Cycles
                ref={this.cycles_ref}
                editable_datasets_ref={this.editable_datasets_ref}
              />
            )}
            <div style={{ overflowX: 'scroll' }}>
              {selected_cycle && section === 'cycles' && (
                <CycleInfo
                  selected_cycle={selected_cycle}
                  workspace={workspace}
                  cycles_ref={this.cycles_ref}
                />
              )}
              <ManageDatasetModal />
              <LumisectionModal />
              {section !== 'cycles' && (
                <DatasetTable
                  asPath={asPath}
                  section={section}
                  url_filters={filters}
                  dataset_table={waiting_datasets}
                  filterDatasets={filterWaitingDatasets}
                  // ofts for OFfline Top Sortings (O.F.T.S)
                  sorting_prefix_from_url="ofts"
                  // oftf for OFfline Top Filters
                  filter_prefix_from_url="oftf"
                  defaultPageSize={5}
                  show_workspace_state_columns_button={false}
                  table_label="Datasets waiting to appear in DQM GUI"
                />
              )}
              <DatasetTable
                ref={this.editable_datasets_ref}
                asPath={asPath}
                section={section}
                url_filters={filters}
                dataset_table={editable_datasets}
                filterDatasets={filterEditableDatasets}
                // ofbs for OFfline Bottom Sortings
                sorting_prefix_from_url="ofbs"
                // ofbf for OFfline Bottom Filters
                filter_prefix_from_url="ofbf"
                defaultPageSize={20}
                show_workspace_state_columns_button
                table_label="Editable datasets"
              />
            </div>
          </div>
        </Content>
      </Page>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.info,
  selected_cycle: state.offline.cycles.selected_cycle,
  waiting_datasets: state.offline.waiting_datasets,
  editable_datasets: state.offline.editable_datasets,
});

export default withRouter(
  connect(mapStateToProps, {
    fetchWorkspaces,
    filterWaitingDatasets,
    filterEditableDatasets,
  })(Offline)
);
