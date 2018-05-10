import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class TopNav extends Component {
    render() {
        return (
            <Header className="header">
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="0">
                        <span>
                            <img
                                className="logo"
                                src="./static/images/cms_logo.png"
                            />
                        </span>
                    </Menu.Item>
                    <Menu.Item key="1">ONLINE</Menu.Item>
                    <Menu.Item key="2">OFFLINE</Menu.Item>
                    <Menu.Item key="3">USER</Menu.Item>
                </Menu>
                <style jsx>{`
                    .logo {
                        width: 50px;
                    }
                `}</style>
                <style jsx global>{`
                    .custom-filter-dropdown {
                        padding: 8px;
                        border-radius: 6px;
                        background: #fff;
                        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
                    }

                    .custom-filter-dropdown input {
                        width: 130px;
                        margin-right: 8px;
                    }

                    .highlight {
                        color: #f50;
                    }
                `}</style>
            </Header>
        );
    }
}

export default TopNav;
