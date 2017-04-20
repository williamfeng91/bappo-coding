import React, { Component } from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import styled from 'styled-components';
import 'brace/mode/javascript';
import 'brace/theme/tomorrow';
import {
  fetchApplication,
} from './redux/modules/application';
import {
  createFile,
  fetchPackage,
  updateFile,
} from './redux/modules/file';
import {
  TextInput,
  View,
} from './components/Primitives';

class SDK extends Component {
  state = {
    currFileId: null,
    files: {},
    modified: {},
    creatingNewFile: false,
    newFileName: '',
  };

  componentDidMount() {
    const { appDefinition, fetchPackage } = this.props;
    fetchPackage(appDefinition._id)
      .then((res) => {
        const files = res.data;
        const entry = files.find(f => f.dir === '/' && f.base === 'index.js');
        if (entry) {
          this.setState({
            currFileId: entry._id,
            files: files.reduce((dict, f) => ({
              ...dict,
              [f._id]: f,
            }), {}),
          });
        }
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.appFiles && nextProps.appFiles.length > this.props.appFiles.length) {
      const newFile = nextProps.appFiles[nextProps.appFiles.length - 1];
      this.setState(prevState => ({
        currFileId: newFile._id,
        files: {
          ...prevState.files,
          [newFile._id]: newFile,
        },
      }));
    }
  }

  handleChange = (content) => {
    this.setState(prevState => ({
      files: {
        ...prevState.files,
        [prevState.currFileId]: {
          ...prevState.files[prevState.currFileId],
          content,
        },
      },
      modified: {
        ...prevState.modified,
        [prevState.currFileId]: true,
      },
    }));
  };

  handleSave = () => {
    const { currFileId, files, modified } = this.state;
    const { appDefinition, fetchApplication, updateFile } = this.props;
    if (modified[currFileId]) {
      updateFile(currFileId, {
        content: files[currFileId].content,
      })
      .then(() => {
        this.setState({
          modified: {
            ...modified,
            [currFileId]: false,
          },
        });
        fetchApplication(appDefinition._id);
      });
    }
  };

  handleNewFileInputKeyDown = (event) => {
    if (event.keyCode === 13) { // enter
      event.preventDefault();
      event.stopPropagation();

      if (!(/^[-_.A-Za-z0-9]+$/.test(this.state.newFileName)) ||
        this.state.newFileName === '.' ||
        this.state.newFileName === '..'
      ) {
        return;
      };

      const { appId, createFile } = this.props;
      createFile(appId, '/', this.state.newFileName)
        .then(() => {
          this.setState({
            creatingNewFile: false,
            newFileName: '',
          });
        });
    }
  };

  renderNewFileInput = () => {
    if (this.state.creatingNewFile) {
      return (
        <StyledTextInput
          autoFocus
          onBlur={() => this.setState({ creatingNewFile: false })}
          onChangeText={newFileName => this.setState({ newFileName })}
          onKeyDown={this.handleNewFileInputKeyDown}
          value={this.state.newFileName}
        />
      );
    }
    return (
      <ListItem
        key="new"
        onClick={() => this.setState({ creatingNewFile: true })}
      >
        + New File
      </ListItem>
    );
  };

  renderEditor = () => {
    const { currFileId, files } = this.state;
    if (!currFileId) return <Empty />;

    const editorCommands = [
      {
        name: 'Save',
        bindKey: { win: 'Ctrl-S', mac: 'Command-S' },
        exec: this.handleSave,
      },
      {
        name: 'Indent',
        bindKey: { win: 'Ctrl-]', mac: 'Command-]' },
        exec: editor => editor.blockIndent(),
      },
      {
        name: 'Outdent',
        bindKey: { win: 'Ctrl-[', mac: 'Command-[' },
        exec: editor => editor.blockOutdent(),
      },
    ];

    return (
      <AceEditor
        key={currFileId}
        mode="javascript"
        theme="tomorrow"
        fontSize={14}
        onChange={this.handleChange}
        value={files[currFileId].content}
        editorProps={{ $blockScrolling: Infinity }}
        setOptions={{ useWorker: false }}
        tabSize={2}
        wrapEnabled
        style={{ height: '100%', width: '100%' }}
        commands={editorCommands}
      />
    );
  };

  render() {
    const { currFileId, modified } = this.state;

    return (
      <Container>
        <TreeContainer>
          {this.props.appFiles.map(file => (
            <ListItem
              key={file._id}
              onClick={() => this.setState({ currFileId: file._id })}
              focused={currFileId === file._id}
            >
              {`${file.base}${modified[file._id] ? ' *' : ''}`}
            </ListItem>
          ))}
          {this.renderNewFileInput()}
        </TreeContainer>
        {this.renderEditor()}
      </Container>
    );
  }
}

function mapStateToProps(state, { appId }) {
  const appDefinition = state.application[appId];
  return {
    appDefinition,
    appFiles: appDefinition.files.map(id => state.file[id]).filter(Boolean),
  };
}

export default connect(
  mapStateToProps,
  {
    createFile,
    fetchApplication,
    fetchPackage,
    updateFile,
  },
)(SDK);

const Container = styled(View)`
  flex: 1;
  flex-direction: row;
`;

const TreeContainer = styled(View)`
  font-size: 14px;
  flex: 0 0 150px;
  background-color: #f6f6f6;
  border-right: 1px solid #ccc;
`;

const ListItem = styled(View)`
  flex: none;
  cursor: pointer;
  padding: 5px 10px;
  ${props => props.focused && 'background-color: rgba(0, 0, 0, 0.1);'}
  &:hover {
    background-color: ${props => props.focused ? 'rgba(0, 0, 0, 0.1);' : 'rgba(0, 0, 0, 0.05);'};
  }
`;

const StyledTextInput = styled(TextInput)`
  padding: 5px;
  width: 150px;
`;

const Empty = styled(View)`
  background-color: #f6f6f6;
  height: 100%;
  width: 100%;
`;
