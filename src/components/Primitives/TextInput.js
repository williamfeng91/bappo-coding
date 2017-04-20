import React, { Component, PropTypes } from 'react';
import styled from 'styled-components';

class TextInput extends Component {
  static displayName = 'TextInput';

  static propTypes = {
    /**
     * Custom classname
     */
    className: PropTypes.string,
    /**
     * Callback to get a reference to the input DOM element.
     */
    inputRef: PropTypes.func,
    /**
     * Callback that is called when input is blurred.
     * @param {Event}
     */
    onBlur: PropTypes.func,
    /**
     * Callback that is called when input changes.
     * @param {Event}
     */
    onChange: PropTypes.func,
    /**
     * Callback that is called when input changes.
     * @param {string}
     */
    onChangeText: PropTypes.func,
    /**
     * Callback that is called when text input ends.
     * @param {string}
     */
    onEndEditing: PropTypes.func,
    /**
     * Callback that is called when keyboard is pressed.
     * @param {Event}
     */
    onKeyDown: PropTypes.func,
  };

  handleBlur = (event) => {
    const { onBlur, onEndEditing } = this.props;

    if (typeof onBlur === 'function') {
      onBlur(event);
    }
    if (typeof onEndEditing === 'function') {
      onEndEditing(event.target.value);
    }
  };

  handleChange = (event) => {
    const { onChange, onChangeText } = this.props;

    if (typeof onChange === 'function') {
      onChange(event);
    }
    if (typeof onChangeText === 'function') {
      onChangeText(event.target.value);
    }
  };

  handleKeyDown = (event) => {
    const { onEndEditing, onKeyDown } = this.props;

    if (typeof onKeyDown === 'function') {
      onKeyDown(event);
    }
    if (event.key === 13 && typeof onEndEditing === 'function') {
      onEndEditing(event.target.value);
    }
  };

  handleRef = (input) => {
    const { inputRef } = this.props;

    this.input = input;
    if (typeof inputRef === 'function') {
      inputRef(input);
    }
  };

  render() {
    const {
      inputRef,
      onChangeText,
      onEndEditing,
      ...otherProps
    } = this.props;
    const props = {
      ...otherProps,
      ref: this.handleRef,
      onBlur: this.handleBlur,
      onChange: this.handleChange,
      onKeyDown: this.handleKeyDown,
    };

    return <input {...props} />;
  }
}

export default styled(TextInput)`
  appearance: none;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 0;
  font: inherit;
`;
