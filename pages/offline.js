import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Breadcrumb, Button } from 'antd';
import moment from 'moment';
import { CHANGE_WORKSPACE, fetchWorkspaces } from '../ducks/offline/workspace';
import { initializeUser, initializeEnvironment } from '../ducks/info';
import store from '../store/configure-store';
import Page from '../layout/page';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import DatasetTable from '../components/offline/dataset_table/DatasetTable';
import Cycles from '../components/offline/cycles/Cycles';
import WaitingListDatasetTable from '../components/offline/dataset_table/WaitingListDatasetTable';
import ManageDatasetModal from '../components/offline/manage_dataset/ManageDatasetModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
import CycleInfo from '../components/offline/cycles/cycleInfo/CycleInfo';
const { Content } = Layout;

class Offline extends Component {
    static async getInitialProps({ store, query, isServer }) {
        if (isServer) {
            initializeUser(store, query);
            initializeEnvironment(store);
        }
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

    render() {
        const { router } = this.props;
        const {
            router: {
                asPath,
                query: { type, section, workspace }
            },
            selected_cycle
        } = this.props;
        const breadcrumbs = asPath.split('/');
        return (
            <Page router={router} show_sidebar={true}>
                <BreadcrumbCmp router={router} online={false}>
                    <Breadcrumb.Item>{type || breadcrumbs[0]}</Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {section || breadcrumbs[1]}
                    </Breadcrumb.Item>
                    <Breadcrumb.Item>
                        {workspace || breadcrumbs[2]}
                    </Breadcrumb.Item>
                </BreadcrumbCmp>
                <Content
                    style={{
                        padding: 0,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        {section === 'cycles' && <Cycles />}
                        <div style={{ overflowX: 'scroll' }}>
                            {selected_cycle && section === 'cycles' && (
                                <CycleInfo
                                    selected_cycle={selected_cycle}
                                    workspace={workspace}
                                />
                            )}
                            <ManageDatasetModal />
                            <LumisectionModal />
                            {section !== 'cycles' && (
                                <WaitingListDatasetTable defaultPageSize={5} />
                            )}
                            <DatasetTable defaultPageSize={20} />
                        </div>
                    </div>
                </Content>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.info,
        selected_cycle: state.offline.cycles.selected_cycle
    };
};

export default withRouter(
    connect(
        mapStateToProps,
        { fetchWorkspaces }
    )(Offline)
);
