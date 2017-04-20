import { combineReducers } from 'redux';
import application from './application';
import file from './file';

module.exports = combineReducers({
  application,
  file,
});
