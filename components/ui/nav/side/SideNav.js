import React, { Component } from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {
    render() {
        return (
            <Layout>
                <Sider collapsible width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
                                    <Icon type="rocket" />
                                    <span>RUNS</span>
                                </span>
                            }
                        >
                            <Menu.Item key="1">ALL</Menu.Item>
                            <Menu.Item key="2">CURRENT</Menu.Item>
                            <Menu.Item key="3">SELECTED</Menu.Item>
                        </SubMenu>
                        <Menu.Item>
                            <span>
                                <Icon type="bulb" />
                                <span>LUMISECTIONS</span>
                            </span>
                        </Menu.Item>
                        <SubMenu
                            key="sub3"
                            title={
                                <span>
                                    <Icon type="laptop" />
                                    <span>WORKSPACE</span>
                                </span>
                            }
                        >
                            <Menu.Item key="4">GLOBAL</Menu.Item>
                            <Menu.Item key="5">BTAG</Menu.Item>
                            <Menu.Item key="6">CASTOR</Menu.Item>
                            <Menu.Item key="7">CSC</Menu.Item>
                            <Menu.Item key="8">CTPPS</Menu.Item>
                            <Menu.Item key="9">DT</Menu.Item>
                            <Menu.Item key="10">ECAL</Menu.Item>
                            <Menu.Item key="11">EGAMMA</Menu.Item>
                            <Menu.Item key="12">HCAL</Menu.Item>
                            <Menu.Item key="13">HLT</Menu.Item>
                            <Menu.Item key="14">JETMET</Menu.Item>
                            <Menu.Item key="15">L1T</Menu.Item>
                            <Menu.Item key="16">LUMI</Menu.Item>
                            <Menu.Item key="17">LUMI</Menu.Item>
                            <Menu.Item key="18">MUON</Menu.Item>
                            <Menu.Item key="19">RPC</Menu.Item>
                            <Menu.Item key="20">TAU</Menu.Item>
                            <Menu.Item key="21">TRACKER</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    {this.props.children}
                </Layout>
            </Layout>
        );
    }
}

export default SideNav;
