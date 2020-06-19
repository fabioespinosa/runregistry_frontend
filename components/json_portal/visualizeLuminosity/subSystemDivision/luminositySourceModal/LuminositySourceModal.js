import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import axios from 'axios';
import stringify from 'json-stringify-pretty-compact';
import { api_url } from '../../../../../config/config';
import { error_handler } from '../../../../../utils/error_handlers';

export const LuminositySourceModal = ({ visible, hideModal, label, runs }) => {
  return (
    <div>
      <Modal
        title={`Visualizing ${label}`}
        visible={visible}
        onOk={hideModal}
        onCancel={
          hideModal // confirmLoading={confirmLoading}
        }
        footer={[
          <Button key="submit" onClick={hideModal}>
            Close
          </Button>,
        ]}
        width="90vw"
        maskClosable={false}
        destroyOnClose={true}
      >
        <ShowLuminosity json_with_dataset_names={runs[label]} />
      </Modal>
    </div>
  );
};

const ShowLuminosity = ({ json_with_dataset_names }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [luminosity, setLuminosity] = useState({});
  useEffect(() => {
    const get_luminosity = error_handler(async () => {
      setLoading(true);
      const {
        data,
      } = await axios.post(
        `${api_url}/lumisections/get_luminosity_of_json_with_dataset_names`,
        { json_with_dataset_names }
      );
      setLuminosity(data);
      setLoading(false);
    });
    try {
      get_luminosity();
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  }, []);

  // Show only runs:
  const runs_with_luminosity = {};
  const runs_ranges = {};
  let total = 0;
  for (const [key, val] of Object.entries(luminosity)) {
    const run = key.split('-')[0];
    runs_with_luminosity[run] = val;
    total += val;
    runs_ranges[run] = json_with_dataset_names[key];
  }
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching luminosity.</div>;
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <div>
          <h2>JSON with LS ranges:</h2>
          <pre>{stringify(runs_ranges)}</pre>
        </div>
        <div>
          <h2>
            Luminosity (total: <strong>{total}/pb</strong>)
          </h2>
          <pre>{stringify(runs_with_luminosity)}</pre>
        </div>
      </div>
    </div>
  );
};
