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
export const welcomeBackground = require('../assets/images/welcomeBackground.jpg');
export const welcomeImage = require('../assets/images/welcomeImage.jpg');

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
    height: '100%',
    width: '100%',
  },
  welcomeImage: {
    height: ReactNative.Dimensions.get('screen').height,
  },
  container: {
    height: ReactNative.Dimensions.get('screen').height,
    width: ReactNative.Dimensions.get('screen').width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: Constants.statusBarHeight,
  },
  resolverContainer: {
    marginHorizontal: 40,
    alignItems: 'flex-start'
  },
  resolvedContainer: {
    flex: 1,
  },
  scrollView: {
    marginHorizontal: 40,
  },
  tab: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Ubuntu_400Regular',
    lineHeight: 40,
    marginTop: 30,
    marginBottom: 30,
    marginHorizontal: 40,
    color: '#57ada5'
  },
  legend: {
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#fff'
  },
  documentLegend: {
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#57ada5'
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '100%',
  },
  button: {
    marginTop: 40,
    margin: 10,
    backgroundColor: '#4e524f',
    padding: 5,
    borderRadius: 5,
    borderBottomWidth: 0,
    alignItems: 'center',
    flexDirection: 'row-reverse'
  },
  buttonText: {
    marginHorizontal: 20,
    fontSize: 40,
    color: '#fff',
    fontFamily: 'Ubuntu_400Regular'
  },
  inputText: {
    fontSize: 20,
    color: '#7e9e81',
    marginTop: 16,
    marginBottom: 30,
    fontFamily: 'Ubuntu_400Regular'
  },
  options: {
    backgroundColor: 'white',
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
  },
  document: {
    backgroundColor: '#fff',
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
  },
  radioCircle: {
    marginHorizontal: 10,
		height: 25,
		width: 25,
		borderRadius: 100,
    borderWidth: 3,
		borderColor: '#4e524f',
		alignItems: 'center',
    justifyContent: 'center',
	},
  radioText: {
    marginHorizontal: 3,
    fontSize: 20,
    fontFamily: 'Ubuntu_400Regular',
    color: '#000',
    fontWeight: '700'
  },
	selectedRb: {
		width: 15,
		height: 15,
		borderRadius: 50,
    backgroundColor: '#4e524f',
  },
});
