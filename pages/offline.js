import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Layout, Breadcrumb } from 'antd';
import { fetchWorkspaces } from '../ducks/offline/workspace';
import { initializeUser, initializeEnvironment } from '../ducks/info';
import store from '../store/configure-store';
import Page from '../layout/page';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import DatasetTable from '../components/offline/dataset_table/DatasetTable';
import WaitingListDatasetTable from '../components/offline/dataset_table/WaitingListDatasetTable';
import ManageDatasetModal from '../components/offline/manage_dataset/ManageDatasetModal';
import LumisectionModal from '../components/offline/lumisections/LumisectionModal';
const { Content } = Layout;

class Offline extends Component {
    static getInitialProps({ store, query, isServer }) {
        if (isServer) {
            initializeUser(store, query);
            initializeEnvironment(store);
        }
        return fetchWorkspaces(store, query, isServer);
    }
    render() {
        const { router } = this.props;
        const {
            router: {
                asPath,
                query: { type, section, workspace }
            }
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
                        // background: '#fff',
                        padding: 0,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <ManageDatasetModal />
                    <LumisectionModal />
                    {/* Hold <i>shift</i> for multiple column sorting. <br />A
                    dataset must appear in DQM GUI for it to be editable
                    (although it can be moved manually by clicking 'move'). */}
                    <WaitingListDatasetTable defaultPageSize={5} />
                    <DatasetTable defaultPageSize={20} />
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
    connect(
        mapStateToProps,
        null
    )(Offline)
);
