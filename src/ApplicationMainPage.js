import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import {
  fetchApplication,
} from './redux/modules/application';
import {
  View,
} from './components/Primitives';
import AppCodeManager from './AppCodeManager';
import SDK from './SDK';

class ApplicationMainPage extends Component {
  componentDidMount() {
    const { match, fetchApplication } = this.props;
    fetchApplication(match.params.appId);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appDefinition &&
      nextProps.appDefinition.bundle &&
      nextProps.appDefinition !== this.props.appDefinition
    ) {
      AppCodeManager.upsert(nextProps.match.params.appId, nextProps.appDefinition.bundle.code);
    }
  }

  renderCustomComponent = () => {
    try {
      const fn = AppCodeManager.run(this.props.appDefinition._id);
      if (!fn) {
        throw new Error('Package not found');
      }
      if (fn.prototype.render) { // React class component
        const CustomComponent = fn;
        return <CustomComponent />;
      }
      return fn();
    } catch(err) {
      return (
        <Container>{err.message}</Container>
      );
    }
  };

  renderApp = () => {
    const { appDefinition } = this.props;
    const { _id, name, bundle } = appDefinition;

    return (
      <RightContainer>
        <BundleContainer>
          <h3>{`${name} Bundle`}</h3>
          {!!bundle && <pre>{bundle.code}</pre>}
        </BundleContainer>
        <Container>
          {this.renderCustomComponent()}
        </Container>
      </RightContainer>
    );
  };

  render() {
    const { appDefinition } = this.props;
    if (!appDefinition) return <h1>Loading...</h1>;

    return (
      <PageContainer>
        <SDKContainer>
          <SDK appId={appDefinition._id} />
        </SDKContainer>
        {this.renderApp()}
      </PageContainer>
    );
  }
}

function mapStateToProps(state, { match }) {
  const { appId } = match.params;
  return {
    appDefinition: state.application[appId],
  };
}

export default connect(
  mapStateToProps,
  {
    fetchApplication,
  },
)(ApplicationMainPage);

const Container = styled(View)`
  flex: 1;
`;

const PageContainer = styled(Container)`
  flex-direction: row;
`;

const SDKContainer = styled(Container)`
  min-width: 500px;
`;

const RightContainer = styled(Container)`
  background-color: white;
  border-left: 1px solid #ccc;
`;

const BundleContainer = styled(View)`
  height: 300px;
  border-bottom: 1px solid #ccc;
  overflow-y: scroll;
`;
