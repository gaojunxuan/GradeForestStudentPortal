import React from 'react';
import { ScrollView, StyleSheet, WebView, Text, View, Button, FlatList, Image, Alert, AsyncStorage, TouchableOpacity } from 'react-native';
import cio from 'cheerio-without-node-native';
import Barcode from 'react-native-barcode-builder';
import { Updates } from 'expo';
import Networking from '../helpers/Networking';
import { Icon } from 'expo';
import { Platform } from 'react-native';
import StringHelper from '../helpers/StringHelper';
import Colors from '../constants/Colors';

var self;
export default class IdScreen extends React.Component {
  static navigationOptions = {
    title: 'My ID',
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: 'white',
    headerRight: (
      <TouchableOpacity onPress={async()=>{
        if(self != null) {
          var username = await AsyncStorage.getItem('username');
          var password = await AsyncStorage.getItem('password');
          try {
            await self.loadData(username, password);
          }
          catch(ex) {
            Alert.alert('Failed to reload data. Please check your Internet connection and try again.');            
          }
        }
      }}>
        <Icon.Ionicons name={Platform.OS === 'ios' ? 'ios-refresh' : 'md-refresh'} style={{ color: 'white', marginRight: 12 }} size={24}/>
      </TouchableOpacity>
    )
  };
  constructor(props) {
    super(props);
    self = this;
    this.state = { token: '', profilePageToken: '', result: '', profile: { first: 'First', middle: 'M', last: 'Last', school: '', grade: '', graduation: '', id: '00000000', fullName: '' }, photo: 'https://cps.edu/branding/publishingimages/secondary-logo-1-1.png', accountType: 'student' };
  }
  async componentWillMount() {
    try {
      var username = await AsyncStorage.getItem('username');
      var password = await AsyncStorage.getItem('password');
      if (username === null || password === null) {
        this.props.navigation.push('Login');
      }
      else {
        await this.loadData(username, password);
      }
    }
    catch(ex) {
      Alert.alert('Failed to load data. Please check your Internet connection and try again.');            
    }
  }
  async loadData(username, password) {
    // headers defs
    const postHeaders = { 'Content-Type': 'multipart/form-data', 'User-Agent': StringHelper.getUserAgentString() };
    const uaHeaders = { 'User-Agent': StringHelper.getUserAgentString() };
    // determine account type
    let accountType = await AsyncStorage.getItem('accountType');
    this.setState({ accountType: accountType });
    if (await AsyncStorage.getItem('accountType') === 'parent') {
      var testResponse = await fetch('https://aspen.cps.edu/aspen/home.do', { method: 'GET', credentials: 'include', headers: uaHeaders });
      var $test = cio.load(await testResponse.text());
      var familyTab = $test('.navTab[title="Family tab"]');
      if(familyTab !== null && familyTab.attr('href').includes('studentContextList')) {
        this.props.navigation.replace('SwitchStudent')
      }
    }
    // load profile page
    let url = 'https://aspen.cps.edu/aspen/portalStudentDetail.do?navkey=myInfo.details.detail';
    if (accountType == 'parent') {
      url = 'https://aspen.cps.edu/aspen/genericDetail.do?navkey=family.std.list.detail';
    }
    var profileResponse = await fetch(url, { method: 'GET', headers: uaHeaders, credentials: 'include' });
    if(profileResponse.status != 200 || await Networking.refreshCookie()) {
      await Networking.login(username, password);
      profileResponse = await fetch(url, { method: 'GET', headers: uaHeaders, credentials: 'include' });
      await AsyncStorage.setItem('refreshCookie', 'false');
    }
    var data = await profileResponse.text();
    var $ = cio.load(data);
    var dict = { first: '', middle: '', last: '', school: '', grade: '', graduation: '', id: '', fullName: '' };
    dict.first = $('span[id="propertyValue(relStdPsnOid_psnNameFirst)-span"]').text();
    dict.middle = $('span[id="propertyValue(relStdPsnOid_psnNameMiddle)-span"]').text();
    dict.last = $('span[id="propertyValue(relStdPsnOid_psnNameLast)-span"]').text();
    dict.id = $('span[id="propertyValue(stdIDLocal)-span"]').text();
    dict.school = $('span[id="propertyValue(relStdSklOid_sklSchoolName)-span"]').text();
    dict.grade = $('span[id="propertyValue(stdGradeLevel)-span"]').text();
    dict.graduation = $('span[id="propertyValue(stdYog)-span"]').text();
    if (accountType === 'parent') {
      dict.fullName = $('span[id="propertyValue(stdViewName)-span"]').text();
    }
    this.setState({ profilePageToken: data.match(/name="org.apache.struts.taglib.html.TOKEN" value="(.*?)"/)[1] });
    this.setState({ profile: dict });
    // load id photo
    var profileForm = new FormData();
    profileForm.append('userEvent', 2030);
    profileForm.append('userParam', 3);
    profileForm.append('deploymentId', 'aspen');
    profileForm.append('org.apache.struts.taglib.html.TOKEN', this.state.profilePageToken);
    var postResponseProfile = await fetch('https://aspen.cps.edu/aspen/portalStudentDetail.do', { method: 'POST', redirect: 'follow', body: profileForm, headers: postHeaders, credentials: 'include' });
    data = await postResponseProfile.text();
    $ = cio.load(data);
    var photo = 'https://aspen.cps.edu/aspen/' + $('span[id="propertyValue(relStdPsnOid_psnPhoOIDPrim)-span"] > img').attr('src');
    this.setState({ photo: photo });
  }

  render() {
    var name = '';
    name += this.state.profile.last;
    name += ', ' + this.state.profile.first;
    name += ' ' + this.state.profile.middle;
    return (
      <ScrollView style={styles.container}>
        <View style={{ flexDirection: 'row', marginLeft: 24, marginRight: 24, marginTop: 12 }}>
          <Image style={{ width: 64, height: 64, borderRadius: 32 }} source={{ uri: this.state.photo }}></Image>
          <View style={{ marginLeft: 20, marginTop: 4, flex: 1 }}>
            <View style={{ flexDirection: 'row', marginRight: 24 }}>
              <Text style={styles.nameHeader}>{this.state.accountType === 'student' ? name : this.state.profile.fullName}</Text>
            </View>
            <Text style={{ marginTop: 4, color: 'grey' }}>ID#: {this.state.profile.id}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', marginLeft: 16, marginTop: 12 }}>
          <Barcode height={48} value={this.state.profile.id} format='CODE39' />
        </View>
        <View style={{ marginTop: 24, marginLeft: 24, marginRight: 24 }}>
          <Text style={styles.header}>School</Text>
          <Text style={{ fontSize: 16 }}>{this.state.profile.school}</Text>
        </View>
        <View style={{ marginTop: 12, marginLeft: 24, marginRight: 24 }}>
          <Text style={styles.header}>Grade Level</Text>
          <Text style={{ fontSize: 16 }}>{this.state.profile.grade}</Text>
        </View>
        <View style={{ marginTop: 12, marginLeft: 24, marginRight: 24 }}>
          <Text style={styles.header}>Year of Graduation</Text>
          <Text style={{ fontSize: 16 }}>{this.state.profile.graduation}</Text>
        </View>
        <TouchableOpacity style={{ marginBottom: 64 }} onPress={async() => {
          await AsyncStorage.removeItem('username');
          await AsyncStorage.removeItem('password');
          await AsyncStorage.setItem('refreshCookie', 'true');
          Updates.reload();
        }}>
          <View style={{ marginLeft: 24, marginRight: 24, marginTop: 48, backgroundColor: '#E5E5EA', borderRadius: 10 }}>
            <Text style={{ color: '#FF3B30', fontSize: 18, textAlign: 'center', marginTop: 12, marginBottom: 12 }}>Logout</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    )
  }
} 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  nameHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    lineHeight: 24
  },
  header: {
    color: 'grey'
  }
});