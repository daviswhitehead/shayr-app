import _ from 'lodash';
import React, { PureComponent } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import Colors from '../../styles/Colors';
import Icon, { names } from '../Icon';
import styles from './styles';

interface Props {
  ref: any;
  onEdit: (text: string) => void;
  onSubmit: (text: string) => void;
}

interface State {
  isEditing: boolean;
  text: string;
}

export default class SearchBar extends PureComponent<Props, State> {
  textInputRef: any;
  placeholderText: string;

  constructor(props: Props) {
    super(props);

    this.state = {
      isEditing: false,
      text: ''
    };

    this.textInputRef = React.createRef();
    this.placeholderText = 'Search users by name...';
  }

  handleBlur = () => {
    // reset to comment button if comment has no non-whitespace characters
    if (!/\S+/.test(this.state.text)) {
      this.setState({
        isEditing: false,
        text: ''
      });
      if (this.props.onEdit) {
        this.props.onEdit('');
      }
    }
  };

  handleChangeText = (text: string) => {
    this.setState({ text });

    if (this.props.onEdit) {
      this.props.onEdit(text);
    }
  };

  handleFocus = () => {
    this.setState({ isEditing: true });
  };

  onClearPress = () => {
    this.setState({ text: '', isEditing: false });
    if (this.props.onEdit) {
      this.props.onEdit('');
    }
    this.textInputRef.current.blur();
  };

  render() {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => this.textInputRef.current.focus()}
      >
        {this.state.isEditing ? (
          undefined
        ) : (
          <Icon name={names.SEARCH} style={styles.searchIcon} />
        )}
        <TextInput
          ref={this.textInputRef}
          style={styles.textInput}
          placeholder={this.placeholderText}
          placeholderTextColor={Colors.DARK_GRAY}
          value={this.state.text}
          onChangeText={this.handleChangeText}
          onBlur={this.handleBlur}
          onFocus={this.handleFocus}
          autoCompleteType='off'
          autoCorrect={false}
        />
        {this.state.isEditing ? (
          <Icon
            name={names.X_EXIT}
            style={styles.clearIcon}
            onPress={this.onClearPress}
          />
        ) : (
          undefined
        )}
      </TouchableOpacity>
    );
  }
}
