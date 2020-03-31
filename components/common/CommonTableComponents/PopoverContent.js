import axios from 'axios';
import React, { Component } from 'react';
import { Button } from 'antd';
import Linkify from 'react-linkify';
import { api_url } from '../../../config/config';
import { error_handler } from '../../../utils/error_handlers';

import BarPlot from '../editComponent/BarPlot';
import History from '../editComponent/History';

const color_coding = {
  BAD: 'red',
  GOOD: 'green',
  STANDBY: '9B870C',
  EXCLUDED: 'grey',
  NOTSET: 'black',
  EMPTY: 'black',
  ARTIFICIALLY_EMPTY: 'transparent'
};

const linkifyTarget = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);
class PopoverContent extends Component {
  state = {
    lumisection_ranges: [],
    ls_ranges_lengths: [],
    show_history: false,
    loading: true
  };

  fetchLumisectionBar = error_handler(async () => {
    const { run_number, dataset_name, component } = this.props;
    let { data: lumisection_ranges } = await axios.post(
      `${api_url}/datasets_get_lumisection_bar`,
      {
        run_number,
        dataset_name,
        component
      }
    );
    lumisection_ranges = lumisection_ranges || [];
    const ls_ranges_lengths = { title: 'LS' };
    lumisection_ranges.forEach(range => {
      const { start, end, status } = range;
      ls_ranges_lengths[`${start} - ${end}`] = end - start + 1;
    });
    this.setState({
      lumisection_ranges,
      ls_ranges_lengths: [ls_ranges_lengths],
      loading: false
    });
  });

  async componentDidMount() {
    try {
      await this.fetchLumisectionBar();
    } catch (err) {
      this.setState({ loading: false });
    }
  }
  async componentDidUpdate(prevProps) {
    if (
      this.props.run_number !== prevProps.run_number ||
      this.props.dataset_name !== prevProps.dataset_name
    ) {
      // Set loading temporarily:
      this.setState({ lumisection_ranges: [], ls_ranges_lengths: [] });
      await this.fetchLumisectionBar();
    }
  }
  render() {
    const { run_number, dataset_name, component } = this.props;
    const {
      lumisection_ranges,
      ls_ranges_lengths,
      show_history,
      loading
    } = this.state;

    let number_of_lumisections = 0;
    if (lumisection_ranges.length > 0) {
      number_of_lumisections =
        lumisection_ranges[lumisection_ranges.length - 1].end;
    }
    const lumisections_with_comments = lumisection_ranges.filter(
      ({ comment }) => typeof comment !== 'undefined' && comment.length > 0
    );
    return (
      <div className="popover_content">
        <p>
          Run <strong>{run_number}</strong>, from{' '}
          <strong>{dataset_name}</strong>, component{' '}
          <strong>{component.toUpperCase()}</strong>
        </p>
        <div className="lumisection_display">
          <div className="plot">
            <center>
              {loading ? (
                <strong>Loading...</strong>
              ) : lumisection_ranges.length > 0 ? (
                <strong>{number_of_lumisections} Lumisection(s):</strong>
              ) : (
                <strong>No Lumisections</strong>
              )}
            </center>
            <BarPlot
              ls_ranges_lengths={ls_ranges_lengths}
              lumisection_ranges={lumisection_ranges}
              height={50}
            />
          </div>
          <div className="ls_summary">
            <h4>Lumisection Summary:</h4>
            {lumisection_ranges.map(range => {
              const { start, end, status } = range;
              const formatted_range = `${start} - ${end} : ${status}`;
              let color = color_coding[status];
              return <div style={{ color }}>{formatted_range}</div>;
            })}
          </div>
        </div>
        <br />
        {loading ? (
          <center>
            <h4>Loading...</h4>
          </center>
        ) : lumisections_with_comments.length > 0 ? (
          <div>
            <center>
              <h4>Comments:</h4>
            </center>
            {lumisections_with_comments.map(
              ({ status, start, end, comment }) => (
                <div>
                  Status: <strong>{status}</strong>
                  {' - '}From LS: <strong>{start}</strong> to LS:{' '}
                  <strong>{end}</strong>
                  {' - '}Comment:{' '}
                  <strong style={{ wordBreak: 'break-all' }}>
                    <Linkify componentDecorator={linkifyTarget}>
                      {comment}
                    </Linkify>
                  </strong>
                </div>
              )
            )}
          </div>
        ) : (
          <center>
            <h4>No comments in this run</h4>
          </center>
        )}
        <br />
        {show_history && (
          <History
            run_number={run_number}
            dataset_name={dataset_name}
            component={component}
            number_of_lumisections={number_of_lumisections}
          />
        )}

        <center>
          <Button
            onClick={() => this.setState({ show_history: !show_history })}
          >
            {show_history ? 'Hide History' : 'Show History'}
          </Button>
        </center>
        <br />
        <br />
        <style jsx>{`
          .popover_content {
            width: 40vw;
          }

          .lumisection_display {
            display: flex;
          }
          .plot {
            width: 80%;
          }
          .ls_summary {
            width: 20%;
          }
        `}</style>
      </div>
    );
  }
}

export default PopoverContent;
