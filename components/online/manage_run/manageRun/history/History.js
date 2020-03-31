import React, { Component } from 'react';
import axios from 'axios';
import ReactTable from 'react-table';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { api_url } from '../../../../../config/config';
import { components } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';
import Status from '../../../../common/CommonTableComponents/Status';

class History extends Component {
  state = { run_history: [] };
  componentDidMount = error_handler(async () => {
    const { run_number } = this.props;
    const { data: run_history } = await axios.get(
      `${api_url}/run_with_history/${run_number}`
    );
    this.setState({ run_history });
  });

  render() {
    const { run_history } = this.state;
    // const { run } = this.props;
    // let dates = {};
    // for (const [key, val] of Object.entries(run)) {
    //     if (val) {
    //         const history = val.history;
    //         if (Array.isArray(history)) {
    //             // Add local value
    //             val[key] = { ...val };
    //             const { when } = val;
    //             if (dates[when]) {
    //                 dates[when] = dates[when].concat(val);
    //             } else {
    //                 dates[when] = [val];
    //             }
    //             // Add historic values:
    //             history.forEach(change => {
    //                 change[key] = { ...change };
    //                 const { when } = change;
    //                 if (dates[when]) {
    //                     dates[when] = dates[when].concat(change);
    //                 } else {
    //                     dates[when] = [change];
    //                 }
    //             });
    //         }
    //     }
    // }
    // let timeline = [];
    // for (const [key, val] of Object.entries(dates)) {
    //     const event_in_timeline = {};
    //     event_in_timeline.when = key;
    //     val.forEach(change => {
    //         event_in_timeline = { ...event_in_timeline, ...change };
    //     });
    //     timeline.push(event_in_timeline);
    // }
    console.log(run_history);
    // timeline.sort((a, b) => a.when - b.when);
    let columns = [
      {
        Header: 'Time',
        accessor: 'createdAt',
        minWidth: 200,
        Cell: ({ original, value }) => {
          const date = new Date(value).toString();
          const displayed_date = date.split('GMT')[0];
          return <div style={{ textAlign: 'center' }}>{displayed_date}</div>;
        }
      },
      {
        Header: 'User',
        accessor: 'by',
        minWidth: 200,
        Cell: ({ value }) => (
          <div>
            {value.startsWith('auto') ? (
              <span>{value}</span>
            ) : (
              <span style={{ color: 'blue' }}>{value}</span>
            )}
          </div>
        )
      },
      {
        Header: 'Class',
        accessor: 'class',
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        Header: 'Significant',
        accessor: 'significant',
        Cell: ({ original, value }) => {
          if (value) {
            return (
              <div style={{ textAlign: 'center' }}>
                {value.value ? <CheckOutlined /> : <CloseOutlined />}
              </div>
            );
          }
          return <div />;
        }
      },
      {
        Header: 'Stop Reason',
        accessor: 'stop_reason',
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        Header: 'State',
        accessor: 'state',
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        Header: 'hlt key',
        accessor: 'hlt_key',
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
      },
      {
        Header: 'hlt Physics Counter',
        accessor: 'hlt_physics_counter',
        Cell: ({ value }) => <div style={{ textAlign: 'center' }}>{value}</div>
      }
    ];

    const component_columns = components.map(component => {
      return {
        Header: component,
        maxWidth: 66,
        id: `${component}_triplet`,
        accessor: data => {
          const triplet = data[`${component}_triplet`];
          if (typeof triplet === 'object') {
            return triplet;
          }
          // If it is not an object that the history changed from, make the components empty:
          return { status: '', comment: '', cause: '' };
        },
        Cell: ({ value }) => <Status triplet={value} significant={true} />
      };
    });

    columns = [...columns, ...component_columns];
    return (
      <div>
        <h4>History - Changes in the run as time progresses down</h4>
        <ReactTable
          columns={columns}
          data={run_history}
          defaultPageSize={20}
          className="-striped -highlight"
        />
      </div>
    );
  }
}

export default History;
