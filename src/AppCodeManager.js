import _React from 'react';
import _styled from 'styled-components';
import * as _BappoComponents from './components/Primitives';

const apps = {};

const upsert = (appId, code) => {
  // inject dependencies, names must match those defined in rollup options.global
  const React = _React; // eslint-disable-line no-unused-vars
  const StyledComponents = _styled; // eslint-disable-line no-unused-vars
  const BappoComponents = _BappoComponents; // eslint-disable-line no-unused-vars

  // evaluation
  try {
    apps[appId] = eval(`${code}\napp${appId}`); // eslint-disable-line no-eval
  } catch(err) {
    if (/^app\w+ is not defined$/.test(err.message)) {
      apps[appId] = () => {
        throw new Error('Package does not have an export');
      };
    } else {
      console.error(err);
    }
  }
};

const run = (appId) => {
  return apps[appId];
};

export default {
  upsert,
  run,
};
