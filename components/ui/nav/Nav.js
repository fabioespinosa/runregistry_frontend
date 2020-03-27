import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
// import cms_logo from '../../../static/images/cms_logo.png';
import TopNav from './top/TopNav';
import SideNav from './side/SideNav';
import OnlineConfigurationModal from '../../../components/online/configuration/ConfigurationModal';
import OfflineConfigurationModal from '../../../components/offline/configuration/ConfigurationModal';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;

class Nav extends Component {
  render() {
    const { router, children, side_nav } = this.props;
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <OnlineConfigurationModal />
        <OfflineConfigurationModal />
        <TopNav router={router} />
        {side_nav ? <SideNav router={router}>{children}</SideNav> : children}
      </Layout>
    );
  }
}

export default Nav;
