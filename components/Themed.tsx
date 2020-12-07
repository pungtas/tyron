import * as React from 'react';
import * as ReactNative from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

// Background images
export const welcomeBackground = require('../assets/images/welcomeBackground.jpg');


export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & ReactNative.Text['props'];
export type ViewProps = ThemeProps & ReactNative.View['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <ReactNative.Text style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <ReactNative.View style={[{ backgroundColor }, style]} {...otherProps} />;
}

const {width, height} = ReactNative.Dimensions.get("window")

export const styles = ReactNative.StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
  },
  welcomeImage: {
    maxHeight: height,
    maxWidth: width,
    marginHorizontal: 360
  },
  tab: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 30,
    fontFamily: 'Ubuntu_400Regular',
    lineHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
  button: {
    margin: 10,
    backgroundColor: '#58929b',
    padding: 5,
    borderRadius: 5,
    borderBottomWidth: 0,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
    fontFamily: 'Ubuntu_400Regular'
  },
  inputText: {
    fontSize: 25,
    color: '#7e9e81',
    marginBottom: 20,
    fontFamily: 'Ubuntu_400Regular'
  },
  radioText: {
    marginRight: 35,
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#000',
    fontWeight: '700'
  },
	radioCircle: {
		height: 25,
		width: 25,
		borderRadius: 100,
		borderWidth: 3,
		borderColor: '#185c49',
		alignItems: 'center',
		justifyContent: 'center',
	},
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
		backgroundColor: '#708b9b',
  },
});
