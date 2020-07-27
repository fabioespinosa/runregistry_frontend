import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';
import {
  FIND_AND_REPLACE_DATASETS,
  DELETE_DATASETS,
  formatDatasets,
} from './datasets';

export const duplicateDatasets = ({
  target_dataset_name,
  source_dataset_name,
  workspaces,
}) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;

    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': source_dataset_name },
    };
    let { data: datasets } = await axios.post(
      `${api_url}/dc_tools/duplicate_datasets`,
      {
        target_dataset_name,
        source_dataset_name,
        workspaces_to_duplicate_into: workspaces,
        // The filter comes from the editable_datasets filter, which already guarantees we are dealing with a filter that does not include 'waiting dqm gui' datasets
        filter: filter_with_source_dataset_name,
      },
      auth(getState, 'Dataset duplication in batch')
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets,
    });
  });

export const copyDatasetColumn = ({
  source_dataset_name,
  target_dataset_name,
  columns_to_copy,
}) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;

    const filter_with_source_dataset_name_and_target = {
      ...current_filter,
      name: {
        or: [{ '=': source_dataset_name }, { '=': target_dataset_name }],
      },
    };
    let { data: datasets } = await axios.post(
      `${api_url}/dc_tools/copy_column_from_datasets`,
      {
        source_dataset_name,
        target_dataset_name,
        columns_to_copy,
        filter: filter_with_source_dataset_name_and_target,
      },
      auth(getState, 'Copy columns across datasets')
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets,
    });
  });

export const datasetUpdate = ({
  source_dataset_name,
  from_state,
  to_state,
  change_in_all_workspaces,
}) =>
  error_handler(async (dispatch, getState) => {
    if (!source_dataset_name) {
      throw { message: 'You need to select a dataset name' };
    }
    if (!from_state || !to_state) {
      throw {
        message:
          'You need to select a from state and a state you wish to change the datasets',
      };
    }
    const current_filter = getState().offline.editable_datasets.filter;
    const workspace = getState().offline.workspace.workspace.toLowerCase();
    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': source_dataset_name },
    };
    let datasets;
    if (change_in_all_workspaces) {
      const { data } = await axios.post(
        `${api_url}/dc_tools/change_multiple_dataset_states_in_all_workspaces/${to_state}`,
        {
          filter: filter_with_source_dataset_name,
        },
        auth(getState, 'Change dataset state in batch (in all workspaces)')
      );
      datasets = data;
    } else {
      try {
        const { data } = await axios.post(
          `${api_url}/dc_tools/change_multiple_dataset_states/${workspace}/${from_state}/${to_state}`,
          {
            filter: filter_with_source_dataset_name,
          },
          auth(getState, 'Change dataset state in batch')
        );
        datasets = data;
      } catch (err) {
        if (err.response.status === 401 && to_state === 'OPEN') {
          // Show message to turn to cycles view
          err.response.data.message = `
        <h3>You should be able to perform the change of state back to OPEN in the cycle's view (if there is an ongoing certification cycle, in the cycle view, click on your workspace and select the current cycle)</h3>
        <p><a href="/offline/cycles/global">Go to cycle's view.</a></p>
        <p>The reason we don't allow changing state back to OPEN in this view is because we want to prevent someone from editing a dataset way in the past. (And in this view you can select any dataset, whereas in the cycle view you can only select those that belong to the cycle we are currently certifying).</p>
        <p>By keeping the datasets we don't want anyone changing in a state different than OPEN state, we are safe no one will edit them</p>
        <p>If you want to be able to move a dataset in the past back to OPEN, contact the DC team or make yourself part of the e-groups below</p>
        ${err.response.data.message}`;
        }
        throw err;
      }
    }
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets,
    });
  });

export const datasetColumnBatchUpdate = ({ columns_to_update, new_status }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    let { data: datasets } = await axios.post(
      `${api_url}/dc_tools/dataset_column_batch_update`,
      {
        filter: current_filter,
        columns_to_update,
        new_status,
      },
      auth(getState, 'Change column status in batch')
    );

    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets,
    });
  });

export const deleteDatasets = ({ reason_for_hiding, dataset_name }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': dataset_name },
    };
    const { headers } = auth(getState);
    let { data: datasets } = await axios.delete(
      `${api_url}/dc_tools/hide_datasets`,
      {
        headers,
        data: {
          reason_for_hiding,
          filter: filter_with_source_dataset_name,
        },
      }
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: DELETE_DATASETS,
      payload: datasets,
    });
  });

export const exportToCSV = (columns) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const current_sortings = getState().offline.editable_datasets.sortings;
    const { data: datasets } = await axios.post(
      `${api_url}/datasets/export_to_csv`,
      {
        columns,
        sortings: current_sortings,
        filter: current_filter,
      }
    );
    return datasets;
  });

const INITIAL_STATE = {};
export default function (state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}
