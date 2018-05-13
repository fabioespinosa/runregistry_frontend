import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import Link from 'next/link';
import { Layout } from 'antd';
import store from '../store/configure-store';
import Page from '../layout/page';
import Breadcrumb from '../components/ui/breadcrumb/Breadcrumb';
import RunTable from '../components/online/run_table/RunTable';
const { Content } = Layout;

class Offline extends Component {
    static getInitialProps({ store, isServer }) {
        // Init auth

        return {};
    }

    render() {
        const { router } = this.props;
        return (
            <Page router={router}>
                <Breadcrumb router={router} />
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

export default withRouter(connect(null, null)(Offline));
