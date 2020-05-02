import axios from 'axios';
import stringify from 'json-stringify-pretty-compact';
import auth from '../../auth/auth';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';

const FETCH_CONFIGURATIONS = 'FETCH_CONFIGURATIONS';
const GENERATE_JSON = 'GENERATE_JSON';
const CHANGE_JSON_LOGIC = 'CHANGE_JSON_LOGIC';
const RESET_JSON = 'RESET_JSON';

export const getJsonConfigurations = () =>
  error_handler(async (dispatch) => {
    const { data: json_configurations } = await axios.get(
      `${api_url}/classifiers/json_classifier`
    );
    // We transform the array of configurations into an object that has {'golden': classifier, 'dcs': classifier} and we PARSE the string of classifier into JS object
    const reducer = (indexed_by_name, { name, classifier }) => ({
      ...indexed_by_name,
      [name]: JSON.parse(classifier),
    });
    const indexed_by_name = json_configurations.reduce(reducer, {});
    dispatch({
      type: FETCH_CONFIGURATIONS,
      payload: { indexed_by_name, json_configurations },
    });
  });

export const addConfiguration = (new_configuration, name) =>
  error_handler(async (dispatch, getState) => {
    const { data: configuration } = await axios.post(
      `${api_url}/classifiers/json_classifier`,
      {
        classifier: new_configuration,
        name,
      },
      auth(getState)
    );
  });

export const editConfiguration = (selected_classifier) =>
  error_handler(async (dispatch, getState) => {
    const { data: configuration } = await axios.put(
      `${api_url}/classifiers/json_classifier/${selected_classifier.id}`,
      { ...selected_classifier },
      auth(getState)
    );
  });

export const deleteJsonConfiguration = (configuration_id) =>
  error_handler(async (dispatch, getState) => {
    const { data: classifier } = await axios.delete(
      `${api_url}/classifiers/json_classifier/${configuration_id}`,
      auth(getState)
    );
  });

export const generateJson = (json_logic) =>
  error_handler(async (dispatch, getState) => {
    const { data: json_output } = await axios.post(
      `${api_url}/json_creation/generate`,
      {
        json_logic,
      },
      auth(getState)
    );
    const { final_json, dataset_in_run_in_json } = json_output;
    dispatch({
      type: GENERATE_JSON,
      payload: { final_json, dataset_in_run_in_json, json_logic },
    });
  });

export const calculateJson = (json_logic, dataset_name) =>
  error_handler(async (dispatch, getState) => {
    const { data: json_output } = await axios.post(
      `${api_url}/json_portal/generate`,
      {
        json_logic,
        dataset_name,
      },
      auth(getState)
    );
    const { id } = json_output;
    console.log(json_output);
    return id;
  });

export const changeJsonLogic = (new_json_logic) => ({
  type: CHANGE_JSON_LOGIC,
  payload: new_json_logic,
});

export const resetJson = () => ({
  type: RESET_JSON,
});

const INITIAL_STATE = {
  json_logic: '{}',
  json_configurations: {},
  json_configurations_array: [],
  current_json: '{}',
  dataset_in_run_in_json: {},
  number_of_runs: 0,
  number_of_lumisections: 0,
};

export default function (state = INITIAL_STATE, action) {
  const { type, payload } = action;

  switch (type) {
    case FETCH_CONFIGURATIONS:
      return {
        ...state,
        json_configurations: payload.indexed_by_name,
        json_configurations_array: payload.json_configurations,
      };
    case GENERATE_JSON:
      const { final_json, dataset_in_run_in_json, json_logic } = payload;
      return {
        ...state,
        current_json: final_json,
        dataset_in_run_in_json,
        json_logic,
        number_of_runs: Object.keys(final_json).length,
        number_of_lumisections: calculate_number_of_lumisections_from_json(
          final_json
        ),
      };
    case RESET_JSON:
      return {
        ...state,
        current_json: '{}',
        dataset_in_run_in_json: {},
        number_of_runs: 0,
        number_of_lumisections: 0,
      };
    case CHANGE_JSON_LOGIC:
      return {
        ...state,
        json_logic: payload,
      };
    default:
      return state;
  }
}

const calculate_number_of_lumisections_from_json = (json) => {
  let number_of_lumisections = 0;
  for (const [run, ranges] of Object.entries(json)) {
    for (const [range_start, range_end] of ranges) {
      const lumisections_in_range = range_end - range_start + 1;
      number_of_lumisections += lumisections_in_range;
    }
  }
  return number_of_lumisections;
};
