import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Layout, Breadcrumb, Button } from 'antd';

import { initializeUser, initializeEnvironment } from '../ducks/info';

import Page from '../layout/page';
import LogViewer from '../components/log/Log';

const { Content } = Layout;

class Log extends Component {
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
                        minHeight: 280,
                        backgroundColor: 'white'
                    }}
                >
                    <LogViewer></LogViewer>
                </Content>
                <style jsx>{``}</style>
            </Page>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

export default withRouter(
    connect(
        mapStateToProps,
        {}
    )(Log)
);
