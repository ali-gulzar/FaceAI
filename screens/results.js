import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ScrollView,

} from 'react-native';
import { Divider, Button, Block, Text, Switch } from '../components';
import { theme } from '../constants';
import Colors from '../constants/Colors';

export default class Results extends Component {

    capitalize = (s) => {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    }

  render() {
    const {data, image} = this.props;
    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={image}/>
          <View style={styles.body}>
            <View style={styles.bodyContent}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <Block>
                    <Block row space="between" margin={[10, 0]}>
                    <Block>
                        <Text gray2 style={{ marginBottom: 10 }}>Age</Text>
                        <Text bold>{data.age}</Text>
                    </Block>
                    </Block>
                    <Block row space="between" margin={[10, 0]}>
                    <Block>
                        <Text gray2 style={{ marginBottom: 10 }}>Gender</Text>
                        <Text bold>{this.capitalize(data.gender)}</Text>
                    </Block>
                    </Block>
                    <Block row space="between" margin={[10, 0]}>
                    <Block>
                        <Text gray2 style={{ marginBottom: 10 }}>BloodLine</Text>
                        <Text bold>{this.capitalize(data.bloodLine)}</Text>
                    </Block>
                    </Block>
                </Block>

                <Divider margin={[theme.sizes.base, theme.sizes.base * 2]} />

                <Block middle flex={0.5} margin={[0, theme.sizes.padding * 2, 20, theme.sizes.padding * 2 ]}>
                    <Button color={Colors.primary} onPress={() => this.props.reset()}>
                     <Text bold white center>Try Again</Text>
                    </Button>
                </Block>

                </ScrollView>
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
    },
    header:{
        backgroundColor: theme.colors.primary,
        height:190,
    },
    avatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 4,
        borderColor: "white",
        marginBottom:10,
        alignSelf:'center',
        position: 'absolute',
        marginTop:85
    },
    body:{
        marginTop:40,
    },
    bodyContent: {
        marginTop: 40,
        padding:30,
    },
    tag: {
        borderColor: theme.colors.gray2,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: theme.sizes.base,
        paddingHorizontal: theme.sizes.base * 2,
        paddingVertical: theme.sizes.base,
        marginRight: theme.sizes.base * 0.625,
        marginBottom: 10,
    },
});
 