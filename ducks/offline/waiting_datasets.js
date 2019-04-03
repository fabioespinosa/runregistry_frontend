import {
    FILTER_WAITING_DATASETS,
    EDIT_DATASET,
    FIND_AND_REPLACE_DATASETS,
    TOGGLE_TABLE_FILTERS
} from './datasets';

const INITIAL_STATE = {
    datasets: []
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;
    switch (type) {
        case FILTER_WAITING_DATASETS:
            return {
                ...state,
                datasets: payload.datasets,
                pages: payload.pages
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
        case TOGGLE_TABLE_FILTERS:
            return { ...state, filterable: !state.filterable };
        default:
            return state;
    }
}

const findId = (array, run_number, dataset_name) => {
    for (let i = 0; i < array.length; i++) {
        if (
            array[i].run_number === run_number &&
            array[i].name === dataset_name
        ) {
            return i;
        }
    }
};

const editDatasetHelper = (datasets, new_dataset) => {
    const index = findId(datasets, new_dataset.run_number, new_dataset.name);
    if (typeof index !== 'undefined') {
        return [
            ...datasets.slice(0, index),
            new_dataset,
            ...datasets.slice(index + 1)
        ];
    }
    return datasets;
};

const findAndReplaceHelper = (datasets, new_datasets) => {
    new_datasets.forEach(new_dataset => {
        datasets = editDatasetHelper(datasets, new_dataset);
    });
    return datasets;
};
