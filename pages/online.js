import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Router from 'next/router';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Layout, Breadcrumb } from 'antd';

import { initializeUser } from '../ducks/info';
import { fetchInitialOnlineRuns } from '../ducks/online/runs';

import store from '../store/configure-store';
import Page from '../layout/page';
import RunTable from '../components/online/run_table/RunTable';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import 'react-table/react-table.css';
// const RunTable = dynamic(import('../components/online/run_table/RunTable'), {
//     ssr: false
// });
const { Content } = Layout;

class Online extends Component {
    static getInitialProps({ store, query, isServer }) {
        // console.log(query);
        // Init auth
        // console.log(fetchInitialOnlineRuns);
        // const promise = await fetchInitialOnlineRuns(store);
        initializeUser(store, query, isServer);
        // return fetchInitialOnlineRuns(store, query, isServer);
    }

    render() {
        const { router } = this.props;
        const {
            router: {
                query: { type, section, run_filter }
            },
            user
        } = this.props;
        return (
            <Page router={router} show_sidebar={false} user={user}>
                <BreadcrumbCmp router={router} online={true}>
                    <Breadcrumb.Item>{type}</Breadcrumb.Item>
                    <Breadcrumb.Item>{section}</Breadcrumb.Item>
                    <Breadcrumb.Item>{run_filter}</Breadcrumb.Item>
                </BreadcrumbCmp>
                <Content
                    style={{
                        background: '#fff',
                        padding: 20,
                        margin: 0,
                        minHeight: 280
                    }}
                >
                    <RunTable />
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
