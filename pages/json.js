import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Layout, Breadcrumb, Button } from 'antd';
import { initializeUser, initializeEnvironment } from '../ducks/info';

import Page from '../layout/page';
import Configuration from '../components/json/configuration/Configuration';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import DatasetTable from '../components/offline/dataset_table/DatasetTable';
import ManageDatasetModal from '../components/offline/manage_dataset/ManageDatasetModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
const { Content } = Layout;

class Json extends Component {
    static async getInitialProps({ store, query, isServer }) {
        if (isServer) {
            initializeUser(store, query);
            initializeEnvironment(store);
        }
    }

    render() {
        const { router } = this.props;
        return (
            <Page router={router} side_nav={false}>
                <Content
                    style={{
                        padding: 0,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <div style={{ display: 'flex' }}>
                        <div style={{ overflowX: 'scroll' }}>
                            <Configuration />
                            {/* <ManageDatasetModal />
                            <LumisectionModal />
                            <DatasetTable defaultPageSize={20} /> */}
                        </div>
                    </div>
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
        {}
    )(Json)
);
