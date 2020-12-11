import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as Welcome from '../screens/WelcomeTabScreen';
import * as Resolver from '../screens/ResolverTabScreen';
import { BottomTabParamList, WelcomeTabParamList, ResolverTabParamList } from '../types';
import * as Themed from '../components/Themed';
import * as Icons from '@expo/vector-icons';
import { Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

let font_state = {
  fontsLoaded: false,
};

let customFonts = {
  Ubuntu_400Regular
};

async function _loadFontsAsync() {
  await Font.loadAsync(customFonts);
}

export default function InitializeTabNavigator() {
  return(
      <BottomTab.Navigator
        initialRouteName="Welcome"
        tabBarOptions={ { 
          activeTintColor: '#000',
          activeBackgroundColor: '#e6c422',
          inactiveBackgroundColor: '#000',
          labelStyle: {
            fontSize: 30,
            fontWeight: '600',
            fontFamily: 'Ubuntu_400Regular',
          },
        }}
        >
        <BottomTab.Screen
          name="Welcome"
          component={Navigator.WelcomeNavigator}
          options={{
            tabBarIcon: ({ color }) => <WelcomeTabBarIcon name="md-planet" color={color} />
          }}
        />
        <BottomTab.Screen
          name="DID browser"
          component={Navigator.ResolverNavigator}
          options={{
            tabBarIcon: ({ color }) => <ResolverTabBarIcon name="rocket1" color={color}/>
          }}
        />
      </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function WelcomeTabBarIcon(props: { name: string; color: string }) {
  return(
    <Ionicons size={25} style={Themed.styles.tab} {...props} />
  );
}

function ResolverTabBarIcon(props: { name: string; color: string }) {
  return(
    <Icons.AntDesign size={25} style={Themed.styles.tab} {...props} />
  );
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab

const WelcomeTabStack = createStackNavigator<WelcomeTabParamList>();
const ResolverTabStack = createStackNavigator<ResolverTabParamList>();

class Navigator extends React.Component {
  static componentDidMount(): any {
    _loadFontsAsync();
    return font_state = {
      fontsLoaded: true,
    };
  }

  public static WelcomeNavigator() {
    const font = Navigator.componentDidMount();

    if (!font.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <WelcomeTabStack.Navigator>
          <WelcomeTabStack.Screen
            name="WelcomeTabScreen"
            component={Welcome.default.WelcomeScreen}
            options={{ 
              headerTitle: '',
              headerTransparent: true,
            }}
          />
        </WelcomeTabStack.Navigator>
      );
    }
  }

  public static ResolverNavigator() {
    const font = Navigator.componentDidMount();

    if (!font.fontsLoaded) {
      return <AppLoading />;
    } else {
      return (
        <ResolverTabStack.Navigator>
          <ResolverTabStack.Screen
            name="Resolve"
            component={Resolver.default.ResolveScreen}
            options={{
              headerTitle: 'DID browser',
              headerTransparent: true,
              headerTitleStyle: {
                fontSize: 30,
                fontWeight: "700",
                fontFamily: 'Ubuntu_400Regular',
                color: '#fff'
              },
            }}
          />
          <ResolverTabStack.Screen
            name="Resolved"
            component={Resolver.default.ResolvedScreen}
            options={{
              headerTitle: 'Tyron self-sovereign identity',
              headerTitleStyle: {
                fontSize: 30,
                fontWeight: "700",
                fontFamily: 'Ubuntu_400Regular',
                color: '#e6c422'
              },
              headerStyle: {
                backgroundColor: '#000',
              },
            }}
          />
        </ResolverTabStack.Navigator>
      );
    }
  }
}