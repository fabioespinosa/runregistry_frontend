import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Progress, Tag } from 'antd';
import moment from 'moment';

import JsonDisplay from './jsonDisplay/JsonDisplay';

class JsonList extends Component {
  renderItem = (item) => {
    const { selected_json, selectJson } = this.props;
    const {
      id,
      dataset_name_filter,
      created_by,
      tags,
      progress,
      active,
      waiting,
      createdAt,
      official,
    } = item;
    const selected = id === selected_json.id;
    const finished = progress === 1;
    return (
      <li key={id} className={`container ${selected && 'selected'}`}>
        {official && (
          <div>
            <Tag color="#87d068">Official</Tag>
          </div>
        )}
        {progress === 1 ? (
          <a
            className={selected && 'selected_link'}
            onClick={() => selectJson(id)}
          >
            {dataset_name_filter}
          </a>
        ) : (
          <a disabled>{dataset_name_filter}</a>
        )}
        <div className="date">
          id: {id} -{' '}
          {createdAt
            ? moment(createdAt).format('MMMM Do YYYY, h:mm:ss a')
            : 'pending'}
        </div>
        <div className="author">By: {created_by}</div>
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
    const { jsons } = this.props;
    return (
      <div>
        <h4>List of JSONS:</h4>
        <ul>
          {jsons.map((item) => {
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

  render() {
    const { jsons, selected_json } = this.props;
    const { toggleDebugging, toggleVisualizeLuminosity } = this.props;
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
            {typeof selected_json.id !== 'undefined' ? (
              <JsonDisplay
                item={selected_json}
                toggleDebugging={toggleDebugging}
                toggleVisualizeLuminosity={toggleVisualizeLuminosity}
              />
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
            height: 70vh;
            overflow-y: scroll;
          }

          .list {
            width: 17%;
            height: 70vh;
            overflow-y: scroll;
          }
          .json_content {
            width: 83%;
          }
        `}</style>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.info,
  };
};

export default connect(mapStateToProps)(JsonList);
