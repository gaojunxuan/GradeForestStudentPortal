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
export default class FacultyDirectoryScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { title: 'Contacts' } } = navigation.state;
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
    this.state = { contact: [] }
    self = this;
  }
  componentDidMount() {
    this.loadData();
  }
  async loadData() {
    var data = await fetch('https://gradeforestbackend.azurewebsites.net/api/GetFacultyList?code=Pr3ZkROv7305O9GwD2z3ajykA/LpZnaNDhttYXl3A9bs6UMaWsNoOA==');
    var serialized = await data.json();
    this.setState({ contact: serialized });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ marginLeft: 24, marginTop: 12, marginBottom: 64 }}>
          {this.state.contact.map(item => {
            return (
              <View key={item.name} style={{ marginTop: 16 }}>
                <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => {
                  Linking.openURL(`mailto:${item.email}`)
                }}>
                  <Image style={{ width: 64, height: 64, borderRadius: 32}} source={{ uri: item.picture }}></Image>
                  <View style={{ justifyContent: 'center', marginLeft: 24 }}>
                    <Text style={{ fontSize: 18 }}>{item.name}</Text>
                    <Text style={{ fontSize: 14, color: 'grey', marginTop: 4 }}>{item.title}</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )
          })}
        </View>
      </ScrollView>
    );
  }
}