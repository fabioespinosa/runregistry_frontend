import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { Statistic, Button } from 'antd';
import moment from 'moment';
import stringify from 'json-stringify-pretty-compact';
import {
  DownloadOutlined,
  BugOutlined,
  PieChartOutlined,
  DeleteOutlined,
  CheckCircleTwoTone,
} from '@ant-design/icons';

const TextEditor = dynamic(
  import('../../../common/ClassifierEditor/JSONEditor/JSONEditor'),
  {
    ssr: false,
  }
);

const calculate_number_of_lumisections_from_json = (json) => {
  let number_of_lumisections = 0;
  for (const [run, ranges] of Object.entries(json)) {
    for (const [range_start, range_end] of ranges) {
      const lumisections_in_range = range_end - range_start + 1;
      number_of_lumisections += lumisections_in_range;
    }
  }
  return number_of_lumisections;
};

class JsonDisplay extends Component {
  state = { number_of_runs_in_json: 0, number_of_lumisections_in_json: 0 };

  getDisplayedJSON(json, length) {
    return stringify(json, { maxLength: length || 44 });
  }

  componentDidMount() {
    this.calculateMetaData();
  }

  calculateMetaData = () => {
    const { item } = this.props;
    const { data, generated_json, generated_json_with_dataset_names } = item;
    this.setState({
      number_of_runs_in_json: Object.keys(generated_json).length,
      number_of_lumisections_in_json: calculate_number_of_lumisections_from_json(
        generated_json
      ),
    });
  };

  componentDidUpdate(prevProps) {
    const { item } = prevProps;
    const { item: nextItem } = this.props;
    if (item && nextItem) {
      if (item.id !== nextItem.id) {
        this.calculateMetaData();
      }
    }
  }

  render() {
    const {
      number_of_runs_in_json,
      number_of_lumisections_in_json,
    } = this.state;
    const { item } = this.props;
    const {
      id,
      dataset_name_filter,
      json_logic,
      generated_json,
      createdAt,
      created_by,
      runregistry_version,
      official,
      generated_json_with_dataset_names,
    } = item;
    const runs = Object.keys(generated_json);
    const run_min = runs[0];
    const run_max = runs[runs.length - 1];
    const download_string = `data:text/json;charset=utf-8,${encodeURIComponent(
      this.getDisplayedJSON(generated_json)
    )}`;
    return (
      <div className="container">
        <div className="json_info">
          <h3>JSON Info:</h3>
          <Statistic title="JSON id" value={`#${id}`} />
          <Statistic title="Runs in JSON" value={number_of_runs_in_json} />
          <Statistic
            title="Lumisections in JSON"
            value={number_of_lumisections_in_json}
          />
          <br />
          <p>From dataset: {dataset_name_filter}</p>
          <p>Minimum run number: {run_min}</p>
          <p>Maximum run number: {run_max}</p>
          <p>
            Created at: {moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')}
          </p>
          <p>By: {created_by}</p>
          <p>
            Official: {official.toString()}{' '}
            {official && <CheckCircleTwoTone twoToneColor="#52c41a" />}
          </p>
          <p>Run Registry version: {runregistry_version}</p>
          <Button type="primary">
            <a href={download_string} download="generated_json.json">
              <DownloadOutlined /> Download generated JSON file
            </a>
          </Button>
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
            value={this.getDisplayedJSON(json_logic, 100)}
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
  }
}

export default JsonDisplay;
