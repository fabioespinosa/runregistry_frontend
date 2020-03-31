import React, { Component } from 'react';
import axios from 'axios';
import Linkify from 'react-linkify';
import { error_handler } from '../../../utils/error_handlers';
import { api_url } from '../../../config/config';

import BarPlot from './BarPlot';

const linkifyTarget = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);

class History extends Component {
  state = {
    history: [],
    loading: true
  };

  async componentDidMount() {
    try {
      await this.fetchHistory();
    } catch (err) {
      this.setState({ loading: false });
    }
  }

  fetchHistory = error_handler(async () => {
    const {
      run_number,
      dataset_name,
      component,
      number_of_lumisections
    } = this.props;
    const { data } = await axios.post(
      `${api_url}/lumisections/get_rr_lumisection_history`,
      {
        run_number,
        dataset_name
      }
    );
    const component_history = data
      .filter(({ jsonb }) => jsonb.hasOwnProperty(component))
      .map(event => {
        const formatted_event = {
          ...event,
          change: event.jsonb[component]
        };
        return formatted_event;
      });
    const history = this.adapt_history(
      component_history,
      number_of_lumisections
    );

    this.setState({ history, loading: false });
  });

  adapt_history = (component_history, number_of_lumisections) => {
    return component_history.map(
      ({ version, change, start, end, by, comment, createdAt }) => {
        const lumisection_ranges = [];
        const ls_ranges_lengths = { title: 'LS' };
        if (start > 1) {
          lumisection_ranges.push({
            status: 'ARTIFICIALLY_EMPTY',
            start: 1,
            end: start - 1
          });
          ls_ranges_lengths[`${1} - ${start - 1}`] = start - 1;
        }
        lumisection_ranges.push({ ...change, start, end });
        ls_ranges_lengths[`${start} - ${end}`] = end - start + 1;
        if (end < number_of_lumisections) {
          lumisection_ranges.push({
            status: 'ARTIFICIALLY_EMPTY',
            start: end + 1,
            end: number_of_lumisections
          });
          ls_ranges_lengths[`${end + 1} - ${number_of_lumisections}`] =
            number_of_lumisections - end;
        }
        return {
          version,
          ls_ranges_lengths: [ls_ranges_lengths],
          lumisection_ranges,
          by,
          comment,
          createdAt,
          change
        };
      }
    );
  };

  render() {
    const { history, loading } = this.state;
    if (loading) {
      return <div>Loading...</div>;
    }
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Ranges</th>
              <th>By</th>
              <th>Comment</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {history.map(
              ({
                version,
                ls_ranges_lengths,
                lumisection_ranges,
                by,
                comment,
                createdAt,
                change
              }) => {
                const parsed_date = new Date(createdAt)
                  .toISOString()
                  .replace(/T/, ' ')
                  .replace(/\..+/, '');
                const change_comment = change.comment;
                return (
                  <tr key={version}>
                    <td className="viz">
                      <BarPlot
                        ls_ranges_lengths={ls_ranges_lengths}
                        lumisection_ranges={lumisection_ranges}
                        height={50}
                        margin={{
                          top: 0,
                          right: 0,
                          left: 0,
                          bottom: 0
                        }}
                      />
                    </td>
                    <td className="meta_data">{by}</td>
                    <td className="meta_data">
                      <Linkify componentDecorator={linkifyTarget}>
                        {comment}
                        {change_comment && comment && ' - User comment: '}
                        <i>{change_comment}</i>
                      </Linkify>
                    </td>
                    <td className="meta_data">{parsed_date}</td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
        <style jsx>{`
          .viz {
            width: 70%;
            padding-right: 10px;
            padding-left: -20px;
          }

          .meta_data {
            font-size: 0.7em;
          }
        `}</style>
      </div>
    );
  }
}

export default History;
