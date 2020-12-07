import * as React from 'react';
import { StyleSheet, Text as DefaultText, View as DefaultView } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

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

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export const styles = StyleSheet.create({
  backgroundImage: {
    width: 1920,
    height: 1080
  },
  welcomeImage: {
    width: 520,
    height: 920,
    alignItems: "center"
  },
  tab: {
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  title: {
    fontSize: 30,
    lineHeight: 40,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
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
  },
  inputText: {
    fontSize: 25,
    color: '#7e9e81',
    marginBottom: 20,  
  },
  radioText: {
        marginRight: 35,
        fontSize: 20,
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
