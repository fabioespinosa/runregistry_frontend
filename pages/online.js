import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Router from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Layout, Breadcrumb } from 'antd';

import { initializeUser, initializeEnvironment } from '../ducks/info';

import store from '../store/configure-store';
import Page from '../layout/page';
import RunTable from '../components/online/run_table/RunTable';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import SignificantRunTable from '../components/online/run_table/SignificantRunTable';
import ManageRunModal from '../components/online/manage_run/ManageRunModal';
import LumisectionModal from '../components/common/CommonTableComponents/lumisectionModal/LumisectionModal';
import ClassifierVisualizationModal from '../components/online/classifier_visualization/ClassifierVisualizationModal';
// const RunTable = dynamic(import('../components/online/run_table/RunTable'), {
//     ssr: false
// });
const { Content } = Layout;

class Online extends Component {
    static getInitialProps({ store, query, isServer }) {
        if (isServer) {
            initializeUser(store, query);
            initializeEnvironment(store);
        }
        return {};
    }

    render() {
        const { router } = this.props;
        const {
            router: {
                asPath,
                query: { type, section, run_filter }
            },
            user
        } = this.props;

        const breadcrumbs = asPath.split('/');
        return (
            <Page router={router} show_sidebar={false} user={user}>
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
    connect(
        mapStateToProps,
        null
    )(Online)
);
