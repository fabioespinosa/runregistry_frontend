import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import Swal from 'sweetalert2';
import { addDatasetsToCycle } from '../../../../../ducks/offline/cycles';

class AddDatasetsToCycle extends Component {
  addDatasetsToCycle = async () => {
    const {
      selected_cycle,
      addDatasetsToCycle,
      hideConfigurationModal,
    } = this.props;
    const { id_cycle } = selected_cycle;
    const cycle = await addDatasetsToCycle({ id_cycle });
    await Swal(`Cycle ${cycle.id_cycle} modified`, '', 'success');
    hideConfigurationModal();
  };

  render() {
    const {
      datasets,
      count,
      filter,
      hideConfigurationModal,
      selected_cycle,
    } = this.props;
    const { id_cycle } = selected_cycle;
    return (
      <div>
        <h3>Add datasets to cycle</h3>
        <div style={{ display: 'flex' }}>
          <div style={{ marginLeft: '10px' }}>
            <h5
              style={{
                textAlign: 'center',
                color: 'red',
              }}
            >
              {count} Datasets Selected
            </h5>
            <h5>
              {Object.keys(filter).length === 0
                ? `WARNING: NO FILTER, APPLYING TO ALL DATASETS (${count}). To make a filter, do it in the lower table (Editable datasets)`
                : `With filter: ${JSON.stringify(filter)}`}
            </h5>
            <br />
            <strong>
              Datasets Being added to the cycle (showing JUST a sample):
            </strong>
            <br />
            <ul>
              {datasets.map(({ run_number, name }) => (
                <li key={`${run_number}-${name}`}>
                  Name: <strong>{name}</strong>, Run number:{' '}
                  <strong>{run_number}</strong>
                </li>
              ))}
            </ul>
            <br />
            <div>
              <Button type="primary" onClick={this.addDatasetsToCycle}>
                Add datasets to cycle with id: {id_cycle}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { addDatasetsToCycle })(AddDatasetsToCycle);
