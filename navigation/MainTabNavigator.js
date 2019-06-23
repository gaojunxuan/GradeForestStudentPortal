import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import AcademicsScreen from '../screens/AcademicsScreen';
import LoginScreen from '../screens/LoginScreen';
import TrainTrackerScreen from '../screens/TrainTrackerScreen';
import AssignmentDetailScreen from '../screens/AssignmentDetailScreen';
import AssignmentListScreen from '../screens/AssignmentListScreen';
import FacultyDirectoryScreen from '../screens/FacultyDirectoryScreen';
import IdScreen from '../screens/IdScreen';
import LunchMenuScreen from '../screens/LunchMenuScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  TrainTracker: TrainTrackerScreen,
  Id: IdScreen,
  LunchMenu: LunchMenuScreen
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-home`
          : 'md-home'
      }
    />
  ),
};

const AcademicsStack = createStackNavigator({
  Academics: AcademicsScreen,
  Login: LoginScreen,
  AssignmentDetail: AssignmentDetailScreen,
  AssignmentList: AssignmentListScreen
});

AcademicsStack.navigationOptions = {
  tabBarLabel: 'Academics',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-school' : 'md-school'}
    />
  ),
};

const ContactsStack = createStackNavigator({
  Contacts: FacultyDirectoryScreen,
});

ContactsStack.navigationOptions = {
  tabBarLabel: 'Contacts',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-contacts' : 'md-contacts'}
    />
  ),
};

export default createBottomTabNavigator({
  HomeStack,
  AcademicsStack,
  ContactsStack,
});
