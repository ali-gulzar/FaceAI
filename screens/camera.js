import React from 'react';
import { View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Entypo, FontAwesome } from '@expo/vector-icons';

export default class OpenCamera extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.front,
  };

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      this.props.close(false);
    }
  }

  handlePhoto = async () => {
    if(this.camera){
      let photo = await this.camera.takePictureAsync();
      this.props.process(photo)
      this.props.close(true)
    }  
  }

  render() {
      return (
        <View style={{ flex: 1 }}>
          <Camera style={{ flex: 1 }} type={this.state.type} ref={ (ref) => {this.camera = ref} }>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                flexDirection: 'row',
              }}>

                <TouchableOpacity style={{
                  flex: 0.2,
                  alignSelf: 'flex-end',
                  alignItems: 'center',
                }}
                onPress={() => {this.setState({
                    type:
                      this.state.type === Camera.Constants.Type.back
                        ? Camera.Constants.Type.front
                        : Camera.Constants.Type.back,
                  });
                }}>
              <FontAwesome name="exchange" size={40} color="white" style={{marginBottom: 20, marginLeft: 10}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{
                  bottom: 0,
                  right: 0,
                  position: 'absolute',
                }}
                onPress={() => this.handlePhoto()}>
                <Entypo name="camera" size={40} color="white" style={{marginBottom: 20, marginRight: 20}}/>
              </TouchableOpacity>
              <TouchableOpacity style={{
                  top: 0,
                  right: 0,
                  position: 'absolute',
                }}
                onPress={() => this.props.close(false)}>
                <Entypo name="cross" size={30} color="white" style={{marginTop: 30, marginRight: 20}}/>
              </TouchableOpacity>
            </View>
          </Camera>
        </View>
      );
    }
}