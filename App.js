import { AppLoading } from 'expo';
import React, {Component} from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import Welcome from './screens/welcome';
import * as Font from 'expo-font';

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isLoadingComplete: false,
    }
  }

  async loadResourcesAsync() {
    await Promise.all([
      Font.loadAsync({
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      })
    ]);
  }

  handleLoadingError(error) {
    console.warn(error)
  }
  
  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourcesAsync}
          onError={this.handleLoadingError}
          onFinish={() => this.setState({isLoadingComplete: true})}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Welcome/>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
});