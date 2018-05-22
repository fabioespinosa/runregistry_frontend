import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
// import cms_logo from '../../../static/images/cms_logo.png';
import TopNav from './top/TopNav';
import SideNav from './side/SideNav';
import OnlineConfigurationModal from '../../../components/online/configuration/ConfigurationModal';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Nav extends Component {
    render() {
        const { router, children } = this.props;
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <OnlineConfigurationModal />
                <TopNav router={router} />
                <SideNav router={router}>{children}</SideNav>
            </Layout>
        );
    }
}

export default Nav;
