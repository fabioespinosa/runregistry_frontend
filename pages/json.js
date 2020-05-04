import React, { Component } from 'react';
import dynamic from 'next/dynamic';
import { connect } from 'react-redux';
import { withRouter } from 'next/router';
import { Layout, Breadcrumb, Button } from 'antd';
import stringify from 'json-stringify-pretty-compact';

import { initializeUser, initializeEnvironment } from '../ducks/info';
import { showModal } from '../ducks/json/ui';

import Page from '../layout/page';
import FilteredTable from '../components/json/filtered_table/FilteredTable';

const TextEditor = dynamic(
  import('../components/common/ClassifierEditor/JSONEditor/JSONEditor'),
  {
    ssr: false,
  }
);

const { Content } = Layout;

class Json extends Component {
  static async getInitialProps({ store, query, isServer }) {
    if (isServer) {
      initializeUser(store, query);
      initializeEnvironment(store);
    }
  }

  getDisplayedJSON(json) {
    return stringify(json, { maxLength: 30 });
  }

  render() {
    const { router, showModal, current_json } = this.props;
    return (
      <Page router={router} side_nav={false}>
        <Content
          style={{
            padding: 0,
            margin: 0,
            minHeight: 280,
          }}
        >
          <div className="show_json_configuration_button">
            <Button onClick={() => showModal('create_json')}>
              Create JSON
            </Button>
          </div>
          <div style={{ display: 'flex' }}>
            <div style={{ overflowX: 'scroll', width: '80%' }}>
              <FilteredTable defaultPageSize={20} />
            </div>
            <div
              style={{
                width: '20%',
                marginLeft: '15px',
                height: '1000px',
              }}
            >
              Current JSON:
              <br />
              <br />
              <TextEditor
                onChange={() => {}}
                value={this.getDisplayedJSON(current_json)}
                lan="javascript"
                theme="github"
                height="80vh"
                readOnly={true}
              />
            </div>
          </div>
        </Content>
        <style jsx>{`
          .show_json_configuration_button {
            margin-top: 10px;
            display: flex;
            justify-content: center;
          }
        `}</style>
      </Page>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.info,
    current_json: state.json.configuration.current_json,
  };
};

export default withRouter(connect(mapStateToProps, { showModal })(Json));
