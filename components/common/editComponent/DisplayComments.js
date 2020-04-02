import React, { Component } from 'react';
import Linkify from 'react-linkify';
const linkifyTarget = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);

class DisplayComments extends Component {
  render() {
    const { lumisections_with_comments, label_width } = this.props;
    return (
      <div>
        {lumisections_with_comments.map(({ status, start, end, comment }) => (
          <div className="row">
            <div className="range_labels">
              Status: <strong>{status}</strong>
              {' - '}From LS: <strong>{start}</strong> to LS:{' '}
              <strong>{end}</strong>
              {' - '}Comment:{' '}
            </div>
            <div className="comments">
              <strong style={{ wordBreak: 'break-all' }}>
                <Linkify componentDecorator={linkifyTarget}>{comment}</Linkify>
              </strong>
            </div>
          </div>
        ))}
        <style jsx>{`
          .row {
            display: flex;
            text-align: left;
          }
          .range_labels {
            width: ${label_width || '37'}%;
          }
          .comments {
            width: ${100 - label_width || '63'}%;
            white-space: pre-wrap;
          }
        `}</style>
      </div>
    );
  }
}

export default DisplayComments;
