import {
  FILTER_EDITABLE_DATASETS,
  EDIT_DATASET,
  FIND_AND_REPLACE_DATASETS,
  DELETE_DATASETS,
  TOGGLE_TABLE_FILTERS,
  CLEAR_DATASETS
} from './datasets';

// Actions of both (editable_datasets and waiting_datasets) are found in their respective file
const INITIAL_STATE = {
  datasets: [],
  pages: 0,
  count: 0,
  filter: {},
  sortings: [],
  filterable: false
};
export default function(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case FILTER_EDITABLE_DATASETS:
      return {
        ...state,
        datasets: payload.datasets,
        pages: payload.pages,
        count: payload.count,
        filter: action.filter,
        sortings: action.sortings
      };
    case EDIT_DATASET:
      return {
        ...state,
        datasets: editDatasetHelper(state.datasets, payload)
      };
    case FIND_AND_REPLACE_DATASETS:
      return {
        ...state,
        datasets: findAndReplaceHelper(state.datasets, payload)
      };
    case DELETE_DATASETS:
      return {
        ...state,
        datasets: findAndDelete(state.datasets, payload)
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
      ...datasets.slice(index + 1)
    ];
  }
  // If it didn't find it, it means it was just created:
  return [new_dataset, ...datasets];
};

const findAndReplaceHelper = (datasets, new_datasets) => {
  new_datasets.forEach(new_dataset => {
    datasets = editDatasetHelper(datasets, new_dataset);
  });
  return datasets;
};

const findAndDelete = (datasets, deleted_datasets) => {
  const new_datasets = datasets.filter(dataset => {
    const { run_number, name } = dataset;
    let dataset_deleted = deleted_datasets.some(dataset => {
      return dataset.run_number === run_number && dataset.name === name;
    });
    return !dataset_deleted;
  });
  return new_datasets;
};
