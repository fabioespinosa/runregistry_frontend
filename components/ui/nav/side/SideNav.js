import React, { Component } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router';
import { Layout, Menu, Icon, Badge } from 'antd';

const { Sider } = Layout;
const SubMenu = Menu.SubMenu;

class SideNav extends Component {
  onRouteChangeHandler({ key, keyPath }) {
    let url_query = '';
    const filters = window.location.href.split('?')[1];
    if (filters) {
      url_query = filters;
    }
    const {
      router: {
        query: { type, section, workspace }
      }
    } = this.props;
    if (type === 'online') {
      Router.push(
        `/online?type=${type}&workspace=${key}&filters=${url_query}`,
        `/${type}/${key}?${url_query}`
      );
    } else {
      Router.push(
        `/offline?type=${type}&section=${section}&workspace=${key}&filters=${url_query}`,
        `/offline/${section}/${key}?${url_query}`
      );
    }
  }

  displayWorkspace = workspace => {
    const {
      router: {
        query: { section }
      },
      cycles
    } = this.props;
    let workspace_status = 0;
    cycles.forEach(cycle => {
      for (const [key, val] of Object.entries(cycle.cycle_attributes)) {
        if (key.includes('_state')) {
          const workspace_name = key.split('_state')[0];
          if (workspace_name === workspace && val === 'pending') {
            workspace_status += 1;
          }
        }
      }
    });
    const backgroundColor = workspace_status === 0 ? '#52c41a' : '';
    return (
      <Menu.Item key={workspace.toUpperCase()}>
        <div>
          {workspace.toUpperCase()}
          {section === 'cycles' && (
            <Badge
              showZero
              style={{
                backgroundColor
              }}
              count={workspace_status}
              offset={[10, 0]}
            />
          )}
        </div>
      </Menu.Item>
    );
  };

  render() {
    const {
      workspaces,
      cycles,
      selected_cycle,
      router: {
        query: { type, section, workspace }
      }
    } = this.props;
    return (
      <Layout hasSider={true}>
        <Sider collapsible width={200} style={{ background: '#fff' }}>
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
              {workspaces.map(({ workspace }) =>
                this.displayWorkspace(workspace)
              )}
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

const mapStateToProps = (state, ownProps) => {
  const {
    router: { query }
  } = ownProps;
  const { type } = query;
  return {
    workspaces: state[type].workspace.workspaces,
    cycles: state.offline.cycles.cycles,
    selected_cycle: state.offline.cycles.selected_cycle
  };
};

export default connect(mapStateToProps)(SideNav);
