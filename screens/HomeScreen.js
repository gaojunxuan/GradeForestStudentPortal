import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import Colors from '../constants/Colors';
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
  StatusBar
} from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { Icon } from 'expo';

var self;
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
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
  async loadData() {
    var data = await fetch('https://gradeforestbackend.azurewebsites.net/api/GetBasicInformation?code=/Mfo/1CqkZ4rxRCuA2a7gOzEGeXtEsPgN/FfEQyaX6yuFLpysXQ6Uw==');
    var serialized = await data.json();
    this.setState({ name: serialized.name, location: serialized.location, description: serialized.description, image: serialized.image, station: serialized.stationCode });
    var announcementData = await fetch('https://gradeforestbackend.azurewebsites.net/api/GetAnnouncement?code=9rAvWWn1Qd0RUzEcJDfUUa/y8JgwZ6diJwOmeHwGe4zGXzCOnAcv9g==');
    var serializedAnnouncement = await announcementData.json();
    var announcement = [];
    serializedAnnouncement.forEach(item => {
      announcement.push(item);
      this.setState({ announcement: announcement });
    })
  }
  async componentDidMount() {
    this.loadData();
  }

  constructor(props) {
    super(props);
    this.state = { name: '', location: '', description: '', image: 'http://www.yellowmagic.com/wpimages/wpa376de24_06.png', announcement: [], station: '' };
    self = this;
  }

  render() {
    return (
      <ScrollView>
        <StatusBar barStyle='light-content'/>
        <View>
          <ImageBackground style={[styles.shadow, { width: Dimensions.get('window').width - 48, height: 200, alignSelf: 'center', marginTop: 32 }]} imageStyle={{ borderRadius: 16 }} source={{ uri: this.state.image }}>
            <View style={{ position: 'absolute', width: Dimensions.get('window').width - 48, height: 200, backgroundColor: 'black', opacity: 0.5, borderRadius: 16 }}>
            </View>
            <View style={{ flexDirection: 'column' }}>
              <View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  marginLeft: 24,
                  marginTop: 24,
                  color: 'white'
                }}>
                  {this.state.name}
                </Text>
                <Text style={{
                  fontSize: 16,
                  marginLeft: 24,
                  marginTop: 24,
                  color: 'white',
                  opacity: 0.7
                }}>
                  {this.state.location}
                </Text>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity style={{ marginLeft: 24, marginTop: 32 }} onPress={() => {
                  Alert.alert('Info', this.state.description);
                }}>
                  <Icon.Ionicons name='ios-information-circle-outline' style={{ color: 'white', marginRight: 12 }} size={24}></Icon.Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 24, marginTop: 32 }} onPress={() => {
                  this.props.navigation.push('TrainTracker', { station: this.state.station });
                }}>
                  <Icon.Ionicons name='ios-train' style={{ color: 'white', marginRight: 12 }} size={24}></Icon.Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 24, marginTop: 32 }} onPress={() => {
                  this.props.navigation.push('LunchMenu');
                }}>
                  <Icon.Ionicons name='ios-pizza' style={{ color: 'white', marginRight: 12 }} size={24}></Icon.Ionicons>
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 24, marginTop: 32 }} onPress={() => {
                  this.props.navigation.push('Id');
                }}>
                  <Icon.Ionicons name='ios-contact' style={{ color: 'white', marginRight: 12 }} size={24}></Icon.Ionicons>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            marginLeft: 32,
            marginTop: 32
          }}>
            Announcement
          </Text>
          <View style={{ marginTop: 12, marginLeft: 32, justifyContent: 'center', marginBottom: 64 }}>
            {this.state.announcement.map(item => {
              return (
                <TouchableBounce style={{ marginTop: 16 }} key={item.rowKey}>
                  <View style={{
                    flex: 1, 
                    borderRadius: 10,
                    shadowColor: 'black',
                    shadowRadius: 4,
                    shadowOffset:
                    {
                        height: 1
                    },
                    shadowOpacity: 0.2,
                    width: Dimensions.get('window').width - 64,
                    backgroundColor: 'white',
                    borderColor: '#E9E9E9',
                    borderWidth: (Platform.OS === 'android') ? 1.2 : 0,
                    margin: (Platform.OS === 'android') ? 2 : 0
                  }}>
                    <Text style={{ marginLeft: 12, fontSize: 16, fontWeight: 'bold', marginTop: 16 }}>{item.title}</Text>
                    <Text style={{ marginLeft: 12, fontSize: 16, marginTop: 12, marginRight: 12, color: 'grey' }}>{item.date.substring(0, 10)}</Text>
                    <Text style={{ marginLeft: 12, fontSize: 16, marginTop: 12, marginRight: 12, marginBottom: 16 }}>{item.content}</Text>
                  </View>
                </TouchableBounce>
              );
            })}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  shadow: {
    shadowColor: 'black',
    shadowRadius: 6,
    shadowOffset:
    {
        height: 2
    },
    shadowOpacity: 0.3,
  }
});
