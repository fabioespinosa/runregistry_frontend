import React, { Component } from 'react';
import axios from 'axios';
import { Timeline, Button } from 'antd';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';
import Event from './event/Event';

const INITIAL_PAGE_SIZE = 100;
class LogViewer extends Component {
  state = {
    versions: [],
    page: 0,
    pages: 0,
    count: 0,
  };

  componentDidMount = () => this.fetchVersions(0);

  fetchVersions = error_handler(async page => {
    const { data } = await axios.post(`${api_url}/versions/get_versions`, {
      page,
      page_size: INITIAL_PAGE_SIZE,
    });

    const { versions, pages, count } = data;
    this.setState({
      versions: [...this.state.versions, ...versions],
      pages,
      count,
      page,
    });
  });

  generateDot = event => {
    const {
      version,
      comment,
      by,
      createdAt,
      RunEvent,
      DatasetEvent,
      LumisectionEvent,
      OMSLumisectionEvent,
    } = event;
    let dot = <Icon type="clock-circle-o" style={{ fontSize: '16px' }} />;
    let color = 'white';
    if (RunEvent !== null) {
      color = 'blue';
      dot = <Icon type="clock-circle-o" style={{ fontSize: '20px' }} />;
    }
    if (DatasetEvent !== null) {
      color = 'yellow';
    }
    if (LumisectionEvent !== null) {
      color = 'gray';
    }
    if (OMSLumisectionEvent !== null) {
      color = 'black';
    }
  };

  render() {
    return (
      <div>
        <center>
          <h1>Log of versions in Run Registry</h1>
        </center>
        <br />
        <div>
          <Timeline mode="alternate">
            {this.state.versions.map(event => (
              <Timeline.Item
                key={event.version}
                // dot={event => this.generateDot(event)}
              >
                <Event event={event}></Event>
              </Timeline.Item>
            ))}
          </Timeline>
        </div>
        <center>
          <Button onClick={() => this.fetchVersions(this.state.page + 1)}>
            Load more...
          </Button>
        </center>
      </div>
    );
  }
}

export default LogViewer;
