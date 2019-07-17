import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
import config from '../../../../config/config';
const { Header, Content, Footer, Sider } = Layout;

class TopNav extends Component {
    state = {
        hello: 'string'
    };
    render() {
        const {
            router: {
                query: { type, section, workspace }
            },
            user,
            env
        } = this.props;
        // Log to see who has used the webpage on the server:
        console.log('user:', user.displayname);
        const backgroundColor = env === 'staging' ? 'purple' : '';
        return (
            <Header className="header" style={{ backgroundColor }}>
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[type]}
                    style={{
                        lineHeight: '64px',
                        backgroundColor
                    }}
                >
                    <Menu.Item key="0" disabled>
                        <img
                            className="logo"
                            src={`/static/images/cms_logo.png`}
                        />
                        <h4
                            style={{
                                display: 'inline-block',
                                color: 'white',
                                marginLeft: '10px',
                                marginBottom: 0
                            }}
                        >
                            Run Registry
                        </h4>
                    </Menu.Item>
                    <Menu.Item key="online">
                        <Link
                            as={`/online`}
                            href="/online/global?type=online&workspace=global"
                        >
                            <a>ONLINE</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="offline">
                        <Link
                            as={`/offline/datasets/global`}
                            href="/offline?type=offline&section=datasets&workspace=global"
                        >
                            <a>OFFLINE</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item
                        disabled
                        key="warning"
                        style={{ opacity: 1, color: 'red !important' }}
                    >
                        <span
                            onClick={() => {}}
                            style={{
                                color: 'red !important',
                                fontSize: '0.9em'
                            }}
                        >
                            {env === 'staging'
                                ? 'STAGING ENV (FOR TESTING)'
                                : 'OFFICIAL RUN REGISTRY'}
                        </span>
                    </Menu.Item>
                </Menu>
                <div>
                    <h3 className="user_name white">
                        {user.displayname || 'Fabio Espinosa'}
                    </h3>

                    <a
                        className="white"
                        href="https://cmsrunregistry.web.cern.ch/logout"
                    >
                        Log out
                    </a>
                </div>
                <style jsx global>{`
                    .logo {
                        width: 50px;
                    }

                    .header {
                        display: flex;
                        justify-content: space-between;
                    }
                    .white {
                        color: white;
                    }
                    .user_name {
                        display: inline-block;
                        margin-right: 20px;
                    }
                `}</style>
            </Header>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.info,
        env: state.info.environment
    };
};

export default connect(mapStateToProps)(TopNav);
