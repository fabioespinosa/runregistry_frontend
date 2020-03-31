import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import { Statistic, Progress, Tag, Button } from 'antd';
import {
  DownloadOutlined,
  BugOutlined,
  PieChartOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import stringify from 'json-stringify-pretty-compact';
import moment from 'moment';
import axios from 'axios';
import { api_url } from '../../../config/config';
const TextEditor = dynamic(
  import('../../common/ClassifierEditor/JSONEditor/JSONEditor'),
  {
    ssr: false
  }
);

class JsonList extends Component {
  state = { selected_json_id: null, jsons: [] };

  async componentDidMount() {
    await this.fetchJsons();

    this.socket = io(`${api_url}`);
    this.socket.on('progress', evt => {
      this.updateProgress(evt);
    });
    this.socket.on('completed', async evt => {
      await this.fetchJsons();
      console.log('completed', evt);
      // replace completed json
    });
  }

  fetchJsons = async () => {
    const { data } = await axios.get(`${api_url}/json_portal/jsons`);
    // We want no nulls and those in progress on top
    const jsons = data.jsons
      .filter(json => json !== null)
      .sort((a, b) => b.timestamp - a.timestamp);

    this.setState({ jsons });
  };

  updateProgress = event => {
    const { job_id, progress } = event;
    this.setState({
      jsons: this.state.jsons.map(json => {
        if (json.id === job_id) {
          json.progress = progress;
        }
        return json;
      })
    });
  };

  renderItem = item => {
    const { selected_json_id } = this.state;
    const {
      id,
      data,
      returnvalue,
      progress,
      date,
      official,
      by,
      finishedOn
    } = item;
    const { run_min, run_max, dataset_name } = data;
    const selected = id === selected_json_id;
    const finished = progress === 1;
    return (
      <li className={`container ${selected && 'selected'}`}>
        {official && (
          <div>
            <Tag color="#87d068">Official</Tag>
          </div>
        )}
        {progress === 1 ? (
          <a
            className={selected && 'selected_link'}
            onClick={() => this.setState({ selected_json_id: id })}
          >
            {dataset_name}
          </a>
        ) : (
          <a disabled>{dataset_name}</a>
        )}
        <div className="date">
          id: {id} -{' '}
          {finished
            ? moment(finishedOn).format('MMMM Do YYYY, h:mm:ss a')
            : 'pending'}
        </div>
        <div className="author">By: {by}</div>
        <div className="progress">
          <Progress
            percent={(progress * 100).toFixed(1)}
            status={!finished && 'active'}
          />
        </div>

        <style jsx>{`
          .container {
            border-bottom: 1px solid #e8e8e8;
            border-right: 3px solid #e8e8e8;
            background-color: e8e8e8;
            padding: 5px 10px;
          }
          .selected {
            border-top: 2px solid #3498db;
            border-bottom: 2px solid #3498db;
            border-left: 6px solid #3498db;
            background-color: white;
            border-right: none;
          }
          .date {
            font-size: 0.8em;
          }
          .author {
            font-size: 0.85em;
            font-weight: bold;
          }
          .selected_link {
            font-weight: bold;
            text-decoration: underline;
          }
          .progress {
            width: 95%;
          }
        `}</style>
      </li>
    );
  };

  renderList = () => {
    const { jsons } = this.state;
    return (
      <div>
        <h4>List of JSONS:</h4>
        <ul>
          {jsons.map(item => {
            return this.renderItem(item);
          })}
        </ul>
        <style jsx>{`
          ul {
            list-style: none;
            margin-bottom: 0;
          }

          ul > :global(:first-child) {
            border-top-left-radius: 5px;
          }
          ul > :global(:last-child) {
            border-bottom-left-radius: 5px;
          }
          h4 {
            text-align: center;
            border-bottom: 1px solid #e8e8e8;
            border-right: 3px solid #e8e8e8;
            margin-bottom: 0;
          }
        `}</style>
      </div>
    );
  };

  getDisplayedJSON(json, length) {
    return stringify(json, { maxLength: length || 44 });
  }

  renderInfo = selected_json_id => {
    const json_item = this.state.jsons.find(
      item => item.id === selected_json_id
    );
    const { data, returnvalue } = json_item;
    const { run_min, run_max, dataset_name, json_logic } = data;
    const { generated_json, generated_json_with_dataset_names } = returnvalue;

    const parsed_json_logic = JSON.parse(json_logic);
    return (
      <div className="container">
        <div className="json_info">
          <h3>JSON Info:</h3>
          <Statistic title="Runs in JSON" value={1128} />
          <Statistic title="Lumisections in JSON" value={233} />
          <p>From dataset: {dataset_name}</p>
          <p>Minimum possible run number: {run_min}</p>
          <p>Maximum possible run number: {run_max}</p>
          <p>Created at: </p>
          <p>By: </p>
          <p>Official: false</p>
          <p>Run Registry version: 2343353</p>
          <Button icon={<DownloadOutlined />}>Download JSON</Button>
          <br />
          <br />
          <Button icon={<BugOutlined />}>Debug JSON</Button>
          <br />
          <br />
          <Button icon={<PieChartOutlined />}>
            Generate JSON Luminosity losses Visualization
          </Button>
          <br />
          <br />
          <Button icon={<DeleteOutlined />} type="danger">
            Delete JSON
          </Button>
        </div>
        <div className="json_display">
          <h3>JSON Output:</h3>
          <TextEditor
            onChange={() => {}}
            value={this.getDisplayedJSON(generated_json)}
            lan="javascript"
            theme="github"
            height="80vh"
            readOnly={true}
          />
        </div>
        <div className="json_logic">
          <h3>JSON Logic that was used to generate this JSON:</h3>
          <TextEditor
            onChange={() => {}}
            value={this.getDisplayedJSON(parsed_json_logic, 100)}
            lan="javascript"
            theme="github"
            height="80vh"
            readOnly={true}
          />
        </div>

        <style jsx>{`
          .container {
            display: flex;
            background-color: white;
            margin: 30px;
          }
          .json_info {
            width: 25%;
          }
          .json_display {
            width: 30%;
          }
          .json_logic {
            margin-left: 10px;
            width: 45%;
          }
        `}</style>
      </div>
    );
  };

  render() {
    const { jsons, selected_json_id } = this.state;
    return (
      <div className="container">
        <div className="inner_container">
          <div className="list">
            {jsons.length > 0 ? (
              this.renderList()
            ) : (
              <div>
                You have not created any JSONs: click here to create one
              </div>
            )}
          </div>
          <div className="json_content">
            {selected_json_id !== null ? (
              this.renderInfo(selected_json_id)
            ) : (
              <div>Select a JSON on the left</div>
            )}
          </div>
        </div>
        <style jsx>{`
          .container {
            width: 100%;
            background-color: white;
          }

          .inner_container {
            display: flex;
            background-color: white;
            border-right: 2px solid #e8e8e8;
            border-bottom: 2px solid #e8e8e8;
            border-radius: 4px;
          }

          .list {
            width: 17%;
          }
          .json_content {
            width: 83%;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.info
  };
};

export default connect(mapStateToProps)(JsonList);
