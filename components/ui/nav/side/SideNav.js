import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { Layout, Menu, Icon, Badge } from 'antd';
import { offline_column_structure } from '../../../../config/config';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {
    onRouteChangeHandler({ key, keyPath }) {
        const {
            router: {
                query: { type, section, workspace }
            }
        } = this.props;
        Router.push(
            `/offline?type=offline&section=${section}&workspace=${key}`,
            `/offline/${section}/${key}`
        );
    }

    render() {
        const {
            show_sidebar,
            workspaces,
            router: {
                query: { type, section, workspace }
            }
        } = this.props;
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
                            defaultOpenKeys={['workspaces']}
                            defaultSelectedKeys={[workspace]}
                            style={{ height: '100%', borderRight: 0 }}
                        >
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
                                {workspaces.map(({ workspace }) => (
                                    <Menu.Item key={workspace.toUpperCase()}>
                                        <div>
                                            {workspace.toUpperCase()}
                                            <Badge
                                                showZero
                                                style={{
                                                    backgroundColor: '#52c41a'
                                                }}
                                                count={0}
                                                offset={[10, 0]}
                                            />
                                        </div>
                                    </Menu.Item>
                                ))}
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

const mapStateToProps = state => {
    return {
        workspaces: state.offline.workspace.workspaces
    };
};

export default connect(mapStateToProps)(SideNav);
