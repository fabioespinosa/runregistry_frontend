import axios from 'axios';
import { error_handler } from '../../utils/error_handlers';
import { api_url } from '../../config/config';

const GENERATE_JSON = 'GENERATE_JSON';

export const generateJson = configuration =>
    error_handler(async dispatch => {
        const { data: generated_json } = await axios.post(
            `${api_url}/json_creation/generate`,
            {
                json_logic: configuration
            }
        );
        dispatch({
            type: GENERATE_JSON,
            payload: generated_json
        });
    });

const INITIAL_STATE = {
    current_json: '{}'
};

export default function(state = INITIAL_STATE, action) {
    const { type, payload } = action;

    switch (type) {
        case GENERATE_JSON:
            return { current_json: payload };
        default:
            return state;
    }
}
