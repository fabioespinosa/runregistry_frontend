import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
// import cms_logo from '../../../static/images/cms_logo.png';
import TopNav from './top/TopNav';
import SideNav from './side/SideNav';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Nav extends Component {
    state = {
        collapsed: false
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };
    render() {
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <TopNav />
                <SideNav>{this.props.children}</SideNav>
            </Layout>
        );
    }
}

export default Nav;
