import axios from 'axios';
const CancelToken = axios.CancelToken;
let cancel_debugging_datasets_fetch;
import { api_url, WAITING_DQM_GUI_CONSTANT } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import { hideManageDatasetModal } from './ui';
import auth from '../../auth/auth';
export const FILTER_EDITABLE_DATASETS = 'FILTER_EDITABLE_DATASETS-JSON';
export const FIND_AND_REPLACE_DATASETS = 'FIND_AND_REPLACE_DATASETS-JSON';
export const TOGGLE_TABLE_FILTERS = 'TOGGLE_TABLE_FILTERS-OFFLINE-JSON';
export const CLEAR_DATASETS = 'CLEAR_DATASETS-JSON';

// endpoint can be either waiting_list or editable
export const filterEditableDatasets = (
  page_size,
  page,
  sortings,
  filter,
  generated_json_with_dataset_names = {}
) =>
  error_handler(async (dispatch, getState) => {
    const workspace = 'global';
    const name_filter = [{ '<>': 'online' }];
    const state_filter = [
      {
        or: [{ '=': 'OPEN' }, { '=': 'SIGNOFF' }, { '=': 'COMPLETED' }],
      },
    ];
    if (filter.name) {
      name_filter.unshift(filter.name);
    }
    // If user was filtering by state, we also want to include that
    if (filter[`dataset_attributes.${workspace}_state`]) {
      state_filter.unshift(filter[`dataset_attributes.${workspace}_state`]);
      delete filter[`dataset_attributes.${workspace}_state`];
    }

    const filter_with_state_and_name = {
      ...filter,
      name: { and: name_filter },
      // For a dataset to be editable it must be either OPEN, SIGNOFF, or COMPLETED (ALL but waiting dqm gui)
      [`dataset_attributes.${workspace}_state`]: {
        and: state_filter,
      },
    };

    if (cancel_debugging_datasets_fetch) {
      cancel_debugging_datasets_fetch();
    }

    const { data: datasets } = await axios.post(
      `${api_url}/datasets_filtered_ordered`,
      {
        workspace,
        page,
        page_size,
        sortings,
        filter: filter_with_state_and_name,
      },
      {
        cancelToken: new CancelToken(function executor(c) {
          cancel_debugging_datasets_fetch = c;
        }),
      },
      auth(getState)
    );
    datasets.datasets = formatDatasets(datasets.datasets);

    datasets.datasets = formatForJsonDatasets(
      datasets.datasets,
      generated_json_with_dataset_names
    );

    dispatch({
      type: FILTER_EDITABLE_DATASETS,
      payload: datasets,
      // We include the filter because we will need it for DC tools:
      filter,
    });
  });

export const clearDatasets = () => ({
  type: CLEAR_DATASETS,
});

export const formatDatasets = (datasets) => {
  return datasets.map((dataset) => ({
    ...dataset.dataset_attributes,
    ...dataset,
    Run: dataset.Run,
    triplet_summary: dataset.DatasetTripletCache
      ? dataset.DatasetTripletCache.triplet_summary
      : {},
  }));
};

export const formatForJsonDatasets = (
  datasets,
  generated_json_with_dataset_names
) => {
  return datasets.map((dataset) => {
    let included_in_json = false;
    const json_keys = Object.keys(generated_json_with_dataset_names);
    if (json_keys.includes(`${dataset.run_number}-${dataset.name}`)) {
      included_in_json = true;
    }
    return {
      ...dataset,
      included_in_json,
    };
  });
};

// Actions of both (editable_datasets and waiting_datasets) are found in their respective file
const INITIAL_STATE = {
  datasets: [],
  pages: 0,
  count: 0,
  filter: {},
  filterable: false,
};
export default function (state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case FILTER_EDITABLE_DATASETS:
      return {
        ...state,
        datasets: payload.datasets,
        pages: payload.pages,
        count: payload.count,
        filter: action.filter,
      };
    // case EDIT_DATASET:
    //     return {
    //         ...state,
    //         datasets: editDatasetHelper(state.datasets, payload)
    //     };
    case FIND_AND_REPLACE_DATASETS:
      return {
        ...state,
        datasets: findAndReplaceHelper(state.datasets, payload),
      };
    case TOGGLE_TABLE_FILTERS:
      return { ...state, filterable: !state.filterable };
    case CLEAR_DATASETS:
      return INITIAL_STATE;
    default:
      return state;
  }
}

const findId = (array, run_number, dataset_name) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].run_number === run_number && array[i].name === dataset_name) {
      return i;
    }
  }
  return null;
};

const editDatasetHelper = (datasets, new_dataset) => {
  const index = findId(datasets, new_dataset.run_number, new_dataset.name);
  if (index !== null) {
    return [
      ...datasets.slice(0, index),
      new_dataset,
      ...datasets.slice(index + 1),
    ];
  }
  // If it didn't find it, it means it was just created:
  return [new_dataset, ...datasets];
};

const findAndReplaceHelper = (datasets, new_datasets) => {
  new_datasets.forEach((new_dataset) => {
    datasets = editDatasetHelper(datasets, new_dataset);
  });
  return datasets;
};
