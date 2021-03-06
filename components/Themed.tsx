/*
    tyron.did: Self-sovereign digital identity decentralized application on the Zilliqa blockchain platform
    Copyright (C) 2020 Julio Cesar Cabrapan Duarte

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
*/

import * as React from 'react';
import * as ReactNative from 'react-native';
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

// Background images
export const resolverBackground = require('../assets/images/resolverBackground.jpg');
export const welcomeImage = require('../assets/images/welcomeImage.jpg');
export const didNet = require('../assets/images/didnet.jpg');

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

import Constants from 'expo-constants';
export const styles = ReactNative.StyleSheet.create({
  image: {
    height: ReactNative.Dimensions.get('screen').height,
    width: ReactNative.Dimensions.get('screen').width,
    flex: 1,
  },
  container: {
    height: ReactNative.Dimensions.get('screen').height,
    width: ReactNative.Dimensions.get('screen').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  resolverContainer: {
    flex: 1,
    marginTop: 95,
    marginHorizontal: 40,
    alignItems: 'flex-start'
  },
  resolvedContainer: {
    flex: 1,
    marginHorizontal: 40,
    backgroundColor: 'transparent',
    marginTop: Constants.statusBarHeight,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    flex: 1,
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Ubuntu_400Regular',
    lineHeight: 40,
    marginTop: 20,
    marginBottom: 30,
    marginHorizontal: 40,
    color: '#fff'
  },
  legend: {
    fontSize: 25,
    fontWeight: '800',
    fontFamily: 'Ubuntu_400Regular',
    textAlign: 'center',
    marginTop: 25,
    marginBottom: 10,
    color: '#cccccc'
  },
  button: {
    marginVertical: 40,
    backgroundColor: '#e6c422',
    padding: 5,
    borderRadius: 5,
    borderBottomWidth: 0,
    alignItems: 'center',
    flexDirection: 'row-reverse'
  },
  buttonText: {
    marginVertical: 10,
    marginHorizontal: 20,
    fontSize: 30,
    color: '#000',
    fontFamily: 'Ubuntu_400Regular',
    fontWeight: '400'
  },
  inputText: {
    fontSize: 24,
    color: '#000',
    marginBottom: 50,
    fontFamily: 'Ubuntu_400Regular'
  },
  options: {
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  options2: {
    marginVertical: 10,
    backgroundColor: 'transparent'
  },
  options3: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  document: {
    marginHorizontal: 150,
  },
  documentLegend: {
    fontSize: 25,
    fontFamily: 'Ubuntu_400Regular',
    fontWeight: '700',
    marginTop: 25,
    marginBottom: 25,
    color: '#e6c422'
  },
  documentItem: {
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#cccccc',
  },
  documentDescription: {
    marginHorizontal: 60,
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#fff',
  },
  radioCircle: {
    marginHorizontal: 10,
		height: 25,
		width: 25,
		borderRadius: 100,
    borderWidth: 3,
		borderColor: '#e6c422',
		alignItems: 'center',
    justifyContent: 'center',
	},
  radioText: {
    marginHorizontal: 2,
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#fff',
    fontWeight: '500',
  },
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
    backgroundColor: '#cccccc',
  },
});
