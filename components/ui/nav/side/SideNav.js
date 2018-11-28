import React, { Component } from 'react';
import Router from 'next/router';
import { Layout, Menu, Icon } from 'antd';
import {
    root_url_prefix,
    offline_column_structure
} from '../../../../config/config';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {
    onRouteChangeHandler({ key, keyPath }) {
        const {
            router: {
                query: { type, section, workspace }
            }
        } = this.props;
        console.log(keyPath);
        if (key === 'lumisections') {
            Router.push(
                `/offline?type=offline&section=lumisections`,
                `/offline/lumisections`
            );
        } else {
            Router.push(
                `/offline?type=offline&section=${keyPath[1]}&workspace=${key}`,
                `${root_url_prefix}/offline/${keyPath[1]}/${key}`
            );
        }
    }

    render() {
        const {
            show_sidebar,
            router: {
                query: { type, section, workspace }
            }
        } = this.props;
        const defaultSelectedKey =
            section === 'lumisections' ? 'lumisections' : workspace;
        return (
            <Layout hasSider={true}>
                {show_sidebar && (
                    <Sider // collapsible
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
                                {Object.keys(offline_column_structure).map(
                                    offline_component => {
                                        return (
                                            <Menu.Item
                                                key={offline_component.toUpperCase()}
                                            >
                                                {offline_component.toUpperCase()}
                                            </Menu.Item>
                                        );
                                    }
                                )}
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
