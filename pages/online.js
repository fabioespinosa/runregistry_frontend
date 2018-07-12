import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Router from 'next/router';
import Link from 'next/link';
import { Layout, Breadcrumb } from 'antd';

import { initializeUser } from '../ducks/info';
import { fetchInitialOnlineRuns } from '../ducks/online/runs';

import store from '../store/configure-store';
import Page from '../layout/page';
import BreadcrumbCmp from '../components/ui/breadcrumb/Breadcrumb';
import RunTable from '../components/online/run_table/RunTableReactTable';
const { Content } = Layout;

class Online extends Component {
    static getInitialProps({ store, query, isServer }) {
        // console.log(query);
        // Init auth
        // console.log(fetchInitialOnlineRuns);
        // const promise = await fetchInitialOnlineRuns(store);
        initializeUser(store, query);
        return fetchInitialOnlineRuns(store, query);
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
                <BreadcrumbCmp router={router}>
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
