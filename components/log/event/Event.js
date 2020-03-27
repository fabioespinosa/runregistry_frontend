import React, { Component } from 'react';
import { Timeline } from 'antd';

class Event extends Component {
  render() {
    const { event } = this.props;
    const {
      version,
      comment,
      by,
      createdAt,
      run_number,
      name: dataset_name,
      // Following four is to idenfity where the change was:
      run_event,
      dataset_event,
      rr_lumisection_event,
      oms_lumisection_event,
      // IF it was a run event:
      rr_metadata,
      oms_metadata,
      // If it was a dataset event:
      dataset_metadata,
      rr_lumisections_start,
      rr_lumisections_end,
      oms_lumisections_start,
      oms_lumisections_end
    } = event;

    let comment_html = <div></div>;
    if (run_event !== null) {
      comment_html = (
        <div>
          <p>Change on run:</p>
          <p>{JSON.stringify(rr_metadata || oms_metadata)}</p>
        </div>
      );
    }
    if (dataset_event !== null) {
      comment_html = (
        <div>
          <p>Change on dataset:</p>
          <p>{JSON.stringify(dataset_metadata)}</p>
        </div>
      );
    }
    if (rr_lumisection_event !== null) {
      comment_html = (
        <div>
          <p>Change on a RR dataset's lumisection's (not OMS LSs)</p>
          <p>
            From Lumisection <strong>{rr_lumisections_start}</strong> to{' '}
            <strong>{rr_lumisections_end}</strong>
          </p>
        </div>
      );
    }
    if (oms_lumisection_event !== null) {
      comment_html = (
        <div>
          <p>Change on a dataset's OMS lumisection's (not RR LSs)</p>
          <p>
            From Lumisection <strong>{oms_lumisections_start}</strong> to{' '}
            <strong>{oms_lumisections_end}</strong>
          </p>
        </div>
      );
    }

    const parsed_date = new Date(createdAt)
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, '');
    return (
      <div>
        <p>
          Run number: <strong>{run_number}</strong> - Dataset:{' '}
          <strong>{dataset_name}</strong>
        </p>
        <p>
          Version: {version} - {comment} by: <i>{by}</i> - {parsed_date}
        </p>
        {comment_html}
      </div>
    );
  }
}

export default Event;
