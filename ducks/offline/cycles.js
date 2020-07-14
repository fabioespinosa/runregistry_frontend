import axios from 'axios';
import { api_url } from '../../config/config';
import { error_handler } from '../../utils/error_handlers';
import auth from '../../auth/auth';

const FETCH_CYCLES = 'FETCH_CYCLES';
const SELECT_CYCLE = 'SELECT_CYCLE';

export const getCycles = (workspace) =>
  error_handler(async (dispatch, getState) => {
    workspace = workspace.toLowerCase();
    const { data: cycles } = await axios.get(`${api_url}/cycles/${workspace}`);
    const selected_cycle = getState().offline.cycles.selected_cycle;
    if (selected_cycle) {
      const { id_cycle } = selected_cycle;
      const cycle = cycles.find((cycle) => cycle.id_cycle === id_cycle);
      dispatch(selectCycle(cycle));
    }
    dispatch({ type: FETCH_CYCLES, payload: cycles });
  });

export const createCycle = ({ deadline, cycle_attributes, cycle_name }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const { data: cycle } = await axios.post(
      `${api_url}/cycles`,
      { deadline, cycle_attributes, cycle_name, filter: current_filter },
      auth(getState)
    );
    const current_workspace = getState().offline.workspace.workspace;
    dispatch(getCycles(current_workspace));
    return cycle;
  });

export const markCycleComplete = (id_cycle, workspace) =>
  error_handler(
    async (dispatch, getState) => {
      const { data: cycle } = await axios.put(
        `${api_url}/cycles/mark_cycle_complete/${workspace.toLowerCase()}`,
        { id_cycle },
        auth(getState)
      );
      const current_workspace = getState().offline.workspace.workspace;
      dispatch(getCycles(current_workspace));
    },
    null,
    true,
    true
  );

export const moveCycleBackToPending = (id_cycle, workspace) =>
  error_handler(async (dispatch, getState) => {
    const { data: cycle } = await axios.put(
      `${api_url}/cycles/mark_cycle_pending/${workspace.toLowerCase()}`,
      { id_cycle },
      auth(getState)
    );
    const current_workspace = getState().offline.workspace.workspace;
    dispatch(getCycles(current_workspace));
  });

export const moveAllDatasetsInCycleTo = (id_cycle, workspace, to_state) =>
  error_handler(async (dispatch, getState) => {
    const { data: cycle } = await axios.post(
      `${api_url}/cycles/move_all_datasets_to/${workspace.toLowerCase()}`,
      { id_cycle, to_state },
      auth(getState)
    );
    const current_workspace = getState().offline.workspace.workspace;
    dispatch(getCycles(current_workspace));
  });

export const editCycle = ({
  id_cycle,
  deadline,
  cycle_attributes,
  cycle_name,
}) =>
  error_handler(async (dispatch, getState) => {
    const { data: cycle } = await axios.put(
      `${api_url}/cycles`,
      { id_cycle, deadline, cycle_attributes, cycle_name },
      auth(getState)
    );
    const current_workspace = getState().offline.workspace.workspace;
    dispatch(getCycles(current_workspace));
    return cycle;
  });

export const addDatasetsToCycle = ({ id_cycle }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const { data: cycle } = await axios.post(
      `${api_url}/cycles/add_datasets_to_cycle`,
      { id_cycle, filter: current_filter },
      auth(getState)
    );
    return cycle;
  });

export const deleteDatasetsFromCycle = ({ id_cycle }) =>
  error_handler(async (dispatch, getState) => {
    const current_filter = getState().offline.editable_datasets.filter;
    const { data: cycle } = await axios.post(
      `${api_url}/cycles/delete_datasets_from_cycle`,
      { id_cycle, filter: current_filter },
      auth(getState)
    );
    return cycle;
  });

export const selectCycle = (selected_cycle) => ({
  type: SELECT_CYCLE,
  payload: selected_cycle,
});

const INITIAL_STATE = {
  selected_cycle: null,
  cycles: [],
};

export default function (state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_CYCLES:
      return { ...state, cycles: payload };
    case SELECT_CYCLE:
      return { ...state, selected_cycle: payload };
    default:
      return state;
  }
}
