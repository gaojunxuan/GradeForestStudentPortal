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
} from 'react-native';
import TouchableBounce from 'react-native/Libraries/Components/Touchable/TouchableBounce';
import { Icon } from 'expo';
import Colors from '../constants/Colors';

const colors = { 'Red': '#c60c30', 'Blue': '#00a1de', 'Brn': '#62361b', 'G': '#009b3a', 'Org': '#f9461c', 'P': '#522398', 'Pink': '#e27ea6', 'Y': '#f9e300' }
var self;
export default class TrainTrackerScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = { title: 'Train Tracker' } } = navigation.state;
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
                    await self.loadData(self.state.station);
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
    this.state = { trainStatus: [], station: '' }
    self = this;
  }
  async loadData(station) {
    var data = await fetch(`http://lapi.transitchicago.com/api/1.0/ttarrivals.aspx?key=ea19f4f2c064425997a25469a4c06fe0&mapid=${station}&outputType=JSON`);
    var serialized = await data.json();
    var list = serialized.ctatt.eta;
    this.setState({ trainStatus: list });
  }
  async componentDidMount() {
    var station = this.props.navigation.getParam('station', '41490');
    this.setState({ station: station })
    await this.loadData(station);
  }
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  render() {
    return (
      <ScrollView>
        <View style={{ marginLeft: 24, marginRight: 24, marginTop: 32, marginBottom: 64 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24 }}>{this.state.trainStatus[0] !== undefined ? this.state.trainStatus[0].staNm : ''}</Text>
          {this.state.trainStatus.map(item => {
            return (
              <TouchableBounce key={this.uuidv4()} style={{ marginBottom: 12 }}>
                <View style={[styles.shadow, {
                  backgroundColor: colors[item.rt],
                  borderRadius: 10,
                  width: Dimensions.get('window').width - 48,
                  borderColor: '#E9E9E9',
                  borderWidth: (Platform.OS === 'android') ? 1.2 : 0,
                  margin: (Platform.OS === 'android') ? 2 : 0,
                  flexDirection: 'row'
                }]}>
                  <View style={{ flex: 1, marginBottom: 16 }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 12, marginTop: 16, marginRight: 12 }}>{item.destNm}</Text>
                    <Text style={{ color: 'white', fontSize: 16, marginTop: 8, marginLeft: 12, marginRight: 12 }}>{new Date(Date.parse(item.arrT) - Date.now()).getMinutes()} min</Text>
                  </View>
                  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: 'white', fontSize: 16, marginTop: 8, marginRight: 16 }}>{item.isApp === '1' ? 'Due' : ''}</Text>
                    <Text style={{ color: 'white', fontSize: 16, marginTop: 8, marginRight: 16 }} >{item.isDly === '1' ? 'Delayed' : ''}</Text>
                  </View>
                </View>
              </TouchableBounce>
              
            )
          })}
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
    shadowRadius: 4,
    shadowOffset:
    {
      height: 1
    },
    shadowOpacity: 0.2,
  }
});