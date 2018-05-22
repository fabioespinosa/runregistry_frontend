import React, { Component } from 'react';
import Link from 'next/link';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class TopNav extends Component {
    state = {
        hello: 'string'
    };
    render() {
        const {
            router: {
                query: { type, section, run_filter }
            }
        } = this.props;
        return (
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={[type]}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="0">
                        <img
                            className="logo"
                            src="/static/images/cms_logo.png"
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
                            as="/online/runs/all"
                            href="/online?type=online&section=runs&run_filter=all"
                        >
                            <a>ONLINE</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="offline">
                        <Link
                            as="/offline/runs/all"
                            href="/online?type=offline&section=runs&run_filter=all"
                        >
                            <a>OFFLINE</a>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="user">
                        <Link href="/user/runs/all">
                            <a>USER</a>
                        </Link>
                    </Menu.Item>
                </Menu>
                <style jsx>{`
                    .logo {
                        width: 50px;
                    }
                `}</style>
            </Header>
        );
    }
}

export default TopNav;
