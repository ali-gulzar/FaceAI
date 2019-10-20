import React, {Component} from 'react';
import { StyleSheet, View } from 'react-native';
import { FloatingAction } from "react-native-floating-action";
import { Entypo, AntDesign } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import LottieView from 'lottie-react-native';
import {Text, Block} from '../components';
import OpenCamera from './camera';
import * as FileSystem from 'expo-file-system';
import {theme} from '../constants/';
import Results from './results';

var isEmpty = require('lodash.isempty');

const Clarifai = require('clarifai');
const actions = [
    {
      text: "Open Camera",
      icon: <Entypo name="camera" size={20} color="white"/>,
      name: "camera",
      position: 1,
      color: theme.colors.accent
    },
    {
      text: "Open Gallery",
      icon: <AntDesign name="picture" size={20} color="white"/>,
      name: "gallery",
      position: 2,
      color: "#2f95dc"
    }
];

export default class Welcome extends Component {

    constructor(props) {
        super(props)
        this.state = {
            image: null,
            galleryAccess: false,
            welcome: true,
            resultsReady: false,
            openCamera: false,
            results: {}
        }

    }

    closeCamera = (data) => {
        if (data) {
            this.setState({openCamera: false})
        } else {
            this.setState({openCamera:false, welcome: true})
        }
        
    }

    handlePress = (name) => {
        if (name === 'gallery') {
            this.getPermissionAsync();
        } else {
            this.setState({welcome: false, openCamera: true})
        }
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        } else this._pickImage();
    }

    _pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          base64: true,
        });
        if (!result.cancelled) {
            this.setState({welcome: false})
            this.getResults(result);
        }
    };

    getResults = async (image) => {
        const app = new Clarifai.App({
            apiKey: '9bca5068fe224119bcc9c02c1f2cd029'
        });
        this.setState({image})
        const base64Image = await FileSystem.readAsStringAsync(image.uri, { encoding: 'base64' });
        await app.models.predict(Clarifai.DEMOGRAPHICS_MODEL, {base64: base64Image})
        .then((response) => this.displayResults(response))
        .catch((err) => {
            this.setState({welcome: true})
            alert(err);
        });
    }

    displayResults = (response) => {
        const data = response.outputs[0].data
        if (isEmpty(data)) {
            alert("No face found")
            this.setState({welcome: true})
        } else {
            const ref = data.regions[0].data.face;
            const boundingBox = data.regions[0].region_info.bounding_box;
            const age = ref.age_appearance.concepts[0].name;
            const gender = ref.gender_appearance.concepts[0].name;
            const bloodLine = ref.multicultural_appearance.concepts[0].name;
            const results = {boundingBox, age, gender, bloodLine}
            this.setState({resultsReady: true, results})
        }
    }

    resetViews = () => {
        this.setState({image: null,
            galleryAccess: false,
            welcome: true,
            resultsReady: false,
            openCamera: false,
            results: {}
        })
    }
    renderDisplay = () => {
        const {resultsReady, welcome, openCamera, results, image} = this.state;
        if (resultsReady) {
            return <Results data={results} image={image} reset={this.resetViews} />
        } else if (welcome) {
            return(
                <View style={styles.container}>
                    <Block style={{marginTop: 60}}>
                        <Text style={{fontFamily: 'space-mono'}} h1 bold>Welcome</Text>
                    </Block>
            
                    <LottieView
                        autoPlay
                        loop
                        source={require('../assets/animations/hello.json')}
                    />
                    <FloatingAction
                    actions={actions}
                    floatingIcon={<Entypo name="camera" size={25} color="white"/>}
                    onPressItem={name => this.handlePress(name)}
                    showBackground={false}
                    color={theme.colors.primary}
                    />
                </View>
            )
        } else if (openCamera) {
            return <OpenCamera close={this.closeCamera} process={this.getResults}/>
        } else {
            return (
                <View style={styles.container}>
                    <LottieView
                        autoPlay
                        loop
                        source={require('../assets/animations/working.json')}
                    />
                </View>
            )
        }
    }

    render() {
        return this.renderDisplay();
    }
}
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});