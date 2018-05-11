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
                        <img
                            className="logo"
                            src="./static/images/cms_logo.png"
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
                    <Menu.Item key="1">ONLINE</Menu.Item>
                    <Menu.Item key="2">OFFLINE</Menu.Item>
                    <Menu.Item key="3">USER</Menu.Item>
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
