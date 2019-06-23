import React from 'react';
import { Text, Button, TouchableOpacity, Image, View, ScrollView, Alert } from 'react-native';
import Colors from '../constants/Colors';
import { Icon } from 'expo';
import { Platform } from 'react-native';

export default class CalendarScreen extends React.Component {
  render() {
    return (
      <View>
        <Text>Calendar</Text>
        <Button title='button' onPress={()=>{
          Alert.alert('Hello world');
        }}>
        </Button>
      </View>
    );
  }
}

CalendarScreen.navigationOptions = {
  title: 'Calendar',
};