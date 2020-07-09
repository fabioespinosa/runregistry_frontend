import React, { Component } from 'react';
import { Descriptions, Badge } from 'antd';
import { oms_link } from '../../../../../config/config';

const transform_to_array = (attributes) => {
  return Object.entries(attributes)
    .filter(
      (attribute) =>
        // Remove the '_included from 'oms' since its included in components array:
        !attribute[0].includes('_included')
    )
    .map((attribute) => {
      let [key, value] = attribute;
      key = key.split('_').join(' ');
      if (Array.isArray(value)) {
        value = value.join(', ');
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      return { key, value: `${value}` };
    });
};

export default function RunInfo({ run }) {
  const { run_number, oms_attributes, rr_attributes } = run;
  const oms_data = transform_to_array(oms_attributes);
  const rr_data = transform_to_array(rr_attributes);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Descriptions
          title="Run OMS Attributes"
          bordered
          size="small"
          column={1}
        >
          <Descriptions.Item label="OMS link">
            <a target="_blank" href={oms_link(run_number)}>
              Open in OMS
            </a>
          </Descriptions.Item>
          {oms_data.map(({ key, value }) => (
            <Descriptions.Item label={key}>{value}</Descriptions.Item>
          ))}
        </Descriptions>
        <Descriptions
          title="Run Registry Attributes"
          bordered
          size="small"
          column={1}
        >
          {rr_data.map(({ key, value }) => (
            <Descriptions.Item label={key}>{value}</Descriptions.Item>
          ))}
        </Descriptions>
      </div>
      {/* <h4>Datasets</h4> */}
    </div>
  );
}
