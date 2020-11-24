import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as ReactNative from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import WelcomeTabScreen from '../screens/WelcomeTabScreen';
import LogInTabScreen from '../screens/LogInTabScreen';
import CreateTabScreen from '../screens/CreateTabScreen';
import { BottomTabParamList, WelcomeTabParamList, LogInTabParamList, CreateTabParamList } from '../types';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function InitializeTabNavigator() {
  const colorScheme = useColorScheme();

  return (
      <BottomTab.Navigator
        initialRouteName="Welcome"
        tabBarOptions={{ activeTintColor: Colors[colorScheme].tint }}>
        <BottomTab.Screen
          name="Welcome"
          component={WelcomeNavigator}
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="Log into your DID"
          component={LogInNavigator}
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="Create your DID"
          component={CreateNavigator}
          options={{
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
          }}
        />
      </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return(
    <Ionicons size={30} style={styles.tab} {...props} />
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const WelcomeTabStack = createStackNavigator<WelcomeTabParamList>();
function WelcomeNavigator() {
  return (
    <WelcomeTabStack.Navigator>
      <WelcomeTabStack.Screen
        name="WelcomeTabScreen"
        component={WelcomeTabScreen}
        options={{ headerTitle: 'Welcome to tyron.did' }}
      />
    </WelcomeTabStack.Navigator>
  );
}

const LogInTabStack = createStackNavigator<LogInTabParamList>();

function LogInNavigator() {
  return (
    <LogInTabStack.Navigator>
      <LogInTabStack.Screen
        name="LogInTabScreen"
        component={LogInTabScreen}
        options={{ headerTitle: 'Log into your DID' }}
      />
    </LogInTabStack.Navigator>
  );
}

const CreateTabStack = createStackNavigator<CreateTabParamList>();

function CreateNavigator() {
  return (
    <CreateTabStack.Navigator>
      <CreateTabStack.Screen
        name="CreateTabScreen"
        component={CreateTabScreen}
        options={{ headerTitle: 'New DID' }}
      />
    </CreateTabStack.Navigator>
  );
}

const styles = ReactNative.StyleSheet.create({
  tab: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
})