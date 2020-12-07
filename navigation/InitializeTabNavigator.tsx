import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import WelcomeTabScreen from '../screens/WelcomeTabScreen';
import * as Resolver from '../screens/ResolverTabScreen';
import { BottomTabParamList, WelcomeTabParamList, ResolverTabParamList } from '../types';
import * as Themed from '../components/Themed';
import * as Icons from '@expo/vector-icons';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function InitializeTabNavigator() {
  const colorScheme = useColorScheme();

  return(
      <BottomTab.Navigator
        initialRouteName="Welcome"
        tabBarOptions={ { activeTintColor: Colors[colorScheme].tint }}
        >
        <BottomTab.Screen
          name="Welcome"
          component={WelcomeNavigator}
          options={{
            tabBarIcon: ({ color }) => <WelcomeTabBarIcon name="md-planet" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="Resolver"
          component={ResolverNavigator}
          options={{
            tabBarIcon: ({ color }) => <ResolverTabBarIcon name="rocket1" color={color} />,
          }}
        />
      </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function WelcomeTabBarIcon(props: { name: string; color: string }) {
  return(
    <Ionicons size={30} style={Themed.styles.tab} {...props} />
  );
}

function ResolverTabBarIcon(props: { name: string; color: string }) {
  return(
    <Icons.AntDesign size={30} style={Themed.styles.tab} {...props} />
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

const ResolverTabStack = createStackNavigator<ResolverTabParamList>();
function ResolverNavigator() {
  return (
    <ResolverTabStack.Navigator>
      <ResolverTabStack.Screen
        name="Resolve"
        component={Resolver.ResolveScreen}
        options={{ headerTitle: 'Resolver DID Browser' }}
      />
      <ResolverTabStack.Screen
        name="Resolved"
        component={Resolver.ResolvedScreen}
        options={{ headerTitle: 'DID Resolved' }}
      />
    </ResolverTabStack.Navigator>
  );
}
