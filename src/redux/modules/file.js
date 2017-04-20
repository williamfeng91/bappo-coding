const API_ENDPOINT = 'http://localhost:8080';

// Actions
const CREATE = 'file/CREATE';
export const CREATE_SUCCESS = 'file/CREATE_SUCCESS';
const CREATE_FAILURE = 'file/CREATE_FAILURE';
const FETCH_PACKAGE = 'file/FETCH_PACKAGE';
const FETCH_PACKAGE_SUCCESS = 'file/FETCH_PACKAGE_SUCCESS';
const FETCH_PACKAGE_FAILURE = 'file/FETCH_PACKAGE_FAILURE';
const UPDATE = 'file/UPDATE';
const UPDATE_SUCCESS = 'file/UPDATE_SUCCESS';
const UPDATE_FAILURE = 'file/UPDATE_FAILURE';

// Reducer
const INITIAL_STATE = {};

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CREATE_SUCCESS:
      return {
        ...state,
        [action.result.data._id]: action.result.data,
      };
    case FETCH_PACKAGE_SUCCESS:
      return action.result.data.reduce((dict, file) => ({
        ...dict,
        [file._id]: file,
      }), {});
    case UPDATE_SUCCESS:
      return {
        ...state,
        [action.payload.fileId]: {
          ...state[action.payload.fileId],
          ...action.payload.update,
        },
      };
    default:
      return state;
  }
}

// Action Creators
export function createFile(appId, dir, base) {
  const data = {
    dir,
    base,
  };
  return {
    types: [CREATE, CREATE_SUCCESS, CREATE_FAILURE],
    promise: client => client.post(`${API_ENDPOINT}/apps/${appId}/files`, data),
    payload: {
      appId,
      data,
    },
  }
}

export function fetchPackage(appId) {
  return {
    types: [FETCH_PACKAGE, FETCH_PACKAGE_SUCCESS, FETCH_PACKAGE_FAILURE],
    promise: client => client.get(`${API_ENDPOINT}/apps/${appId}/files`),
    payload: {
      appId,
    },
  };
}

export function updateFile(fileId, patch) {
  return {
    types: [UPDATE, UPDATE_SUCCESS, UPDATE_FAILURE],
    promise: client => client.patch(`${API_ENDPOINT}/files/${fileId}`, patch),
    payload: {
      fileId,
      patch,
    },
  };
}
