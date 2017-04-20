import {
  CREATE_SUCCESS as CREATE_FILE_SUCCESS,
} from './file';

const API_ENDPOINT = 'http://localhost:8080';

// Actions
const CREATE = 'application/CREATE';
const CREATE_SUCCESS = 'application/CREATE_SUCCESS';
const CREATE_FAILURE = 'application/CREATE_FAILURE';
const FETCH_ALL = 'application/FETCH_ALL';
const FETCH_ALL_SUCCESS = 'application/FETCH_ALL_SUCCESS';
const FETCH_ALL_FAILURE = 'application/FETCH_ALL_FAILURE';
const FETCH_ONE = 'application/FETCH_ONE';
const FETCH_ONE_SUCCESS = 'application/FETCH_ONE_SUCCESS';
const FETCH_ONE_FAILURE = 'application/FETCH_ONE_FAILURE';

// Reducer
const INITIAL_STATE = {};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_FILE_SUCCESS:
      return {
        ...state,
        [action.payload.appId]: {
          ...state[action.payload.appId],
          files: [
            ...state[action.payload.appId].files,
            action.result.data._id,
          ],
        },
      };
    case FETCH_ALL_SUCCESS:
      return action.result.data.reduce((dict, app) => ({
        ...dict,
        [app._id]: app,
      }), {});
    case CREATE_SUCCESS:
    case FETCH_ONE_SUCCESS:
      return {
        ...state,
        [action.result.data._id]: action.result.data,
      };
    default:
      return state;
  }
}

// Action Creators
export function createApplication(name) {
  const data = {
    name,
  };
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAILURE],
    promise: client => client.post(`${API_ENDPOINT}/apps`, data),
  };
}

export function fetchApplications() {
  return {
    types: [FETCH_ALL, FETCH_ALL_SUCCESS, FETCH_ALL_FAILURE],
    promise: client => client.get(`${API_ENDPOINT}/apps`),
  };
}

export function fetchApplication(appId) {
  return {
    types: [FETCH_ONE, FETCH_ONE_SUCCESS, FETCH_ONE_FAILURE],
    promise: client => client.get(`${API_ENDPOINT}/apps/${appId}`),
  };
}
