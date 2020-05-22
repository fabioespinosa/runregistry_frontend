import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import io from 'socket.io-client';
import axios from 'axios';
import { MailOutlined, AppstoreOutlined } from '@ant-design/icons';
import { selectJson } from '../../ducks/json/ui';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';

import DebuggingJson from './debuggingJson/DebuggingJson';
import VisualizeLuminosity from './visualizeLuminosity/VisualizeLuminosity';
import SubystemDivision from './visualizeLuminosity/subSystemDivision/SubsystemDivision';
const { SubMenu } = Menu;

import JsonList from './jsonList/JsonList';

class JsonPortal extends Component {
  state = {
    selected_tab: 'my_jsons',
    jsons: [],
    debugging_json: false,
    visualize_luminosity: false,
  };

  async componentDidMount() {
    await this.fetchJsons();
    const socket_path = `/${api_url.includes('/api') ? 'api/' : ''}socket.io`;
    this.socket = io(`${api_url.split('/api')[0]}`, {
      path: socket_path,
    });
    this.socket.on('progress', (evt) => {
      this.updateProgress(evt);
    });
    this.socket.on('completed', async (evt) => {
      await this.fetchJsons();
      console.log('completed', evt);
      // replace completed json
    });
    this.socket.on('new_json_added_to_queue', async (evt) => {
      console.log('new job');
      await this.fetchJsons();
    });
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.close();
    }
  }

  fetchJsons = error_handler(async () => {
    const { data } = await axios.get(`${api_url}/json_portal/jsons`);
    // We want no nulls
    const jsons = data.jsons.filter((json) => json !== null);
    this.setState({ jsons });
  });

  changeTab = ({ key }) => {
    this.setState({ selected_tab: key });
  };

  updateProgress = (event) => {
    const { id, progress } = event;
    this.setState({
      jsons: this.state.jsons.map((json) => {
        if (json.id === id) {
          json.progress = progress;
        }
        return json;
      }),
    });
  };

  selectJson = (selected_id) => {
    const json = this.state.jsons.find(({ id }) => id === selected_id);
    this.props.selectJson(json);
    this.setState({ debugging_json: false });
  };

  toggleDebugging = (show) => this.setState({ debugging_json: show });

  toggleVisualizeLuminosity = (show) =>
    this.setState({ visualize_luminosity: show });

  render() {
    const { selected_json } = this.props;
    const {
      selected_tab,
      debugging_json,
      visualize_luminosity,
      jsons,
    } = this.state;
    return (
      <div className="container">
        <Menu
          onClick={this.changeTab}
          selectedKeys={[selected_tab]}
          mode="horizontal"
        >
          <Menu.Item key="my_jsons">
            <MailOutlined />
            My JSONs
          </Menu.Item>
          <Menu.Item key="other_jsons">
            <AppstoreOutlined />
            Other JSONs
          </Menu.Item>
          <Menu.Item key="official_jsons">
            <AppstoreOutlined />
            Official JSONs
          </Menu.Item>
        </Menu>
        <br />
        <br />
        <JsonList
          jsons={jsons}
          category={selected_tab}
          selected_json={selected_json}
          selectJson={this.selectJson}
          toggleDebugging={this.toggleDebugging}
          toggleVisualizeLuminosity={this.toggleVisualizeLuminosity}
          fetchJson={this.fetchJsons}
        />
        {debugging_json && (
          <DebuggingJson selected_json={selected_json} jsons={jsons} />
        )}
        {visualize_luminosity && (
          <div>
            <SubystemDivision selected_json={selected_json} />
            {/* <VisualizeLuminosity selected_json={selected_json} /> */}
          </div>
        )}
        <style jsx>{`
          .container {
            padding: 10px;
            margin-top: 10px;
            margin-left: 30px;
            margin-right: 30px;
            background-color: white;
            border: 1px solid white;
            border-radius: 10px;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selected_json: state.json.ui.selected_json,
  };
};
export default connect(mapStateToProps, { selectJson })(JsonPortal);
