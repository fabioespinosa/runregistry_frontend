import React, { Component } from 'react';
import Router from 'next/router';
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {
    onRouteChangeHandler({ key, keyPath }) {
        const {
            router: {
                query: { type, section, run_filter }
            }
        } = this.props;
        if (key === 'lumisections') {
            Router.push(
                `/${type}?type=${type}&section=lumisections`,
                `/${type}/lumisections`
            );
        } else {
            Router.push(
                `/${type}?type=${type}&section=${keyPath[1]}&run_filter=${key}`,
                `/${type}/${keyPath[1]}/${key}`
            );
        }
    }

    render() {
        const {
            router: {
                query: { type, section, run_filter }
            }
        } = this.props;

        const defaultSelectedKey =
            section === 'lumisections' ? 'lumisections' : run_filter;
        return (
            <Layout hasSider={true}>
                <Sider collapsible width={200} style={{ background: '#fff' }}>
                    <Menu
                        mode="inline"
                        onClick={this.onRouteChangeHandler.bind(this)}
                        defaultOpenKeys={[section]}
                        defaultSelectedKeys={[defaultSelectedKey]}
                        style={{ height: '100%', borderRight: 0 }}
                    >
                        <SubMenu
                            key="runs"
                            title={
                                <span>
                                    <Icon type="rocket" />
                                    RUNS
                                </span>
                            }
                        >
                            <Menu.Item key="all">ALL</Menu.Item>
                            <Menu.Item key="current">CURRENT</Menu.Item>
                            <Menu.Item key="selected">SELECTED</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="lumisections">
                            <span>
                                <Icon type="bulb" />
                                LUMISECTIONS
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
