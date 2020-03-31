import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';
import {
  FIND_AND_REPLACE_DATASETS,
  DELETE_DATASETS,
  formatDatasets
} from './datasets';

export const duplicateDatasets = ({
  target_dataset_name,
  source_dataset_name,
  workspaces
}) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;

    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': source_dataset_name }
    };
    let { data: datasets } = await axios.post(
      `${api_url}/dc_tools/duplicate_datasets`,
      {
        target_dataset_name,
        source_dataset_name,
        workspaces_to_duplicate_into: workspaces,
        // The filter comes from the editable_datasets filter, which already guarantees we are dealing with a filter that does not include 'waiting dqm gui' datasets
        filter: filter_with_source_dataset_name
      },
      auth(getState, 'Dataset duplication in batch')
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets
    });
  });

export const copyDatasetColumn = ({
  source_dataset_name,
  target_dataset_name,
  columns_to_copy
}) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;

    const filter_with_source_dataset_name_and_target = {
      ...current_filter,
      name: {
        or: [{ '=': source_dataset_name }, { '=': target_dataset_name }]
      }
    };
    let { data: datasets } = await axios.post(
      `${api_url}/dc_tools/copy_column_from_datasets`,
      {
        source_dataset_name,
        target_dataset_name,
        columns_to_copy,
        filter: filter_with_source_dataset_name_and_target
      },
      auth(getState, 'Copy columns across datasets')
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets
    });
  });

export const datasetUpdate = ({
  source_dataset_name,
  to_state,
  change_in_all_workspaces
}) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const workspace = getState().offline.workspace.workspace.toLowerCase();
    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': source_dataset_name }
    };
    let datasets;
    if (change_in_all_workspaces) {
      const { data } = await axios.post(
        `${api_url}/dc_tools/change_multiple_dataset_states_in_all_workspaces/${to_state}`,
        {
          filter: filter_with_source_dataset_name
        },
        auth(getState, 'Change dataset state in batch (in all workspaces)')
      );
      datasets = data;
    } else {
      // To get the from_state, we get the state of the first dataset in the editable dataset table. To batch edit it is only possible to go from one state to another, therefore if there are other datasets not in the same state, it will error out
      const first_dataset = getState().offline.editable_datasets.datasets[0];
      const from_state = first_dataset[`${workspace}_state`];
      const { data } = await axios.post(
        `${api_url}/dc_tools/change_multiple_dataset_states/${workspace}/${from_state}/${to_state}`,
        {
          filter: filter_with_source_dataset_name
        },
        auth(getState, 'Change dataset state in batch')
      );
      datasets = data;
    }
    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets
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
        new_status
      },
      auth(getState, 'Change column status in batch')
    );

    datasets = formatDatasets(datasets);
    dispatch({
      type: FIND_AND_REPLACE_DATASETS,
      payload: datasets
    });
  });

export const deleteDatasets = ({ reason_for_hiding, dataset_name }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const filter_with_source_dataset_name = {
      ...current_filter,
      name: { '=': dataset_name }
    };
    const { headers } = auth(getState);
    let { data: datasets } = await axios.delete(
      `${api_url}/dc_tools/hide_datasets`,
      {
        headers,
        data: {
          reason_for_hiding,
          filter: filter_with_source_dataset_name
        }
      }
    );
    datasets = formatDatasets(datasets);
    dispatch({
      type: DELETE_DATASETS,
      payload: datasets
    });
  });

export const exportToCSV = columns =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const current_sortings = getState().offline.editable_datasets.sortings;
    const { data: datasets } = await axios.post(
      `${api_url}/datasets/export_to_csv`,
      {
        columns,
        sortings: current_sortings,
        filter: current_filter
      }
    );
    return datasets;
  });

const INITIAL_STATE = {};
export default function(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    default:
      return state;
  }
}
