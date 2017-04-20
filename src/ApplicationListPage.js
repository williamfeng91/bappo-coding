import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  createApplication,
  fetchApplications,
} from './redux/modules/application';

class ApplicationListPage extends Component {
  state = {
    newAppName: '',
  };

  componentDidMount() {
    this.props.fetchApplications();
  }

  handleCreate = () => {
    this.props.createApplication(this.state.newAppName)
      .then(() => {
        this.setState({ newAppName: '' });
      });
  };

  render() {
    return (
      <div>
        <ul>
          {this.props.apps.map(app => (
            <li key={app._id}>
              <Link to={`/apps/${app._id}`}>{app.name}</Link>
            </li>
          ))}
        </ul>
        <input
          onChange={event => this.setState({ newAppName: event.target.value })}
          value={this.state.newAppName}
        />
        <button
          onClick={this.handleCreate}
        >
          Create
        </button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    apps: Object.keys(state.application).map(id => state.application[id]),
  };
}

export default connect(
  mapStateToProps,
  {
    createApplication,
    fetchApplications,
  },
)(ApplicationListPage);
