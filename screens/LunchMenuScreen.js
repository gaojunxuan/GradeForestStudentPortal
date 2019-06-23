import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Dimensions,
  ImageBackground,
  Linking
} from 'react-native';
import Colors from '../constants/Colors';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { Icon } from 'expo';

var self;
export default class LunchMenuScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { title: 'Lunch Menu' } } = navigation.state;
    return {
      title: params.title,
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: 'white',
      headerRight: (
        <TouchableOpacity onPress={async()=>{
            if(self != null) {
                try {
                    await self.loadData();
                }
                catch(ex) {
                    Alert.alert("Failed to reload data. Please check your Internet connection and try again.");            
                }
            }
        }}>
            <Icon.Ionicons name='ios-refresh' style={{ color: 'white', marginRight: 12 }} size={24}/>
        </TouchableOpacity>
      )
    };
  };
  constructor(props) {
    super(props);
    this.state = { main: '', side: '', cal: '' }
    self = this;
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    var data = await fetch(`https://gradeforestbackend.azurewebsites.net/api/GetLunchMenu?code=jW8FnTxkZOP4n1l3TN1ghPM5lPNrTxELPkCzZjIQRM3/2W1Hexpaag==&day=Monday`);
    var serialized = await data.json();
    this.setState({ main: serialized.main, side: serialized.side, cal: serialized.calories });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ marginLeft: 24, marginTop: 12, marginBottom: 64 }}>
          <Text style={{ fontSize: 18, marginTop: 12, marginRight: 24 }}>{this.state.main}</Text>
          <Text style={{ fontSize: 14, color: 'grey' }}>Main</Text>
    
          <Text style={{ fontSize: 18, marginTop: 12, marginRight: 24 }}>{this.state.side}</Text>
          <Text style={{ fontSize: 14, color: 'grey' }}>Side</Text>

          <Text style={{ fontSize: 18, marginTop: 12, marginRight: 24 }}>{this.state.cal}</Text>
          <Text style={{ fontSize: 14, color: 'grey' }}>Calories</Text>
        </View>
      </ScrollView>
    );
  }
}