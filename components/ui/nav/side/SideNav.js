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
            show_sidebar,
            router: {
                query: { type, section, run_filter }
            }
        } = this.props;
        const defaultSelectedKey =
            section === 'lumisections' ? 'lumisections' : run_filter;
        return (
            <Layout hasSider={true}>
                {show_sidebar && (
                    <Sider
                        // collapsible
                        width={200}
                        style={{ background: '#fff' }}
                    >
                        <Menu
                            mode="inline"
                            onClick={this.onRouteChangeHandler.bind(this)}
                            defaultOpenKeys={[section]}
                            defaultSelectedKeys={[defaultSelectedKey]}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            {/* <SubMenu
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
                            </Menu.Item> */}
                            <SubMenu
                                key="workspaces"
                                title={
                                    <span>
                                        <Icon type="laptop" />
                                        <span>WORKSPACES</span>
                                    </span>
                                }
                            >
                                <Menu.Item key="global">GLOBAL</Menu.Item>
                                <Menu.Item key="BTAG">BTAG</Menu.Item>
                                <Menu.Item key="CASTOR">CASTOR</Menu.Item>
                                <Menu.Item key="CSC">CSC</Menu.Item>
                                <Menu.Item key="CTPPS">CTPPS</Menu.Item>
                                <Menu.Item key="DT">DT</Menu.Item>
                                <Menu.Item key="ECAL">ECAL</Menu.Item>
                                <Menu.Item key="EGAMMA">EGAMMA</Menu.Item>
                                <Menu.Item key="HCAL">HCAL</Menu.Item>
                                <Menu.Item key="HLT">HLT</Menu.Item>
                                <Menu.Item key="JETMET">JETMET</Menu.Item>
                                <Menu.Item key="L1T">L1T</Menu.Item>
                                <Menu.Item key="LUMI">LUMI</Menu.Item>
                                <Menu.Item key="LUMI">LUMI</Menu.Item>
                                <Menu.Item key="MUON">MUON</Menu.Item>
                                <Menu.Item key="RPC">RPC</Menu.Item>
                                <Menu.Item key="TAU">TAU</Menu.Item>
                                <Menu.Item key="TRACKER">TRACKER</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                )}
                <Layout style={{ padding: '0 24px 24px' }}>
                    {this.props.children}
                </Layout>
            </Layout>
        );
    }
}

export default SideNav;
