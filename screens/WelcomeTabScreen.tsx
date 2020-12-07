import * as React from 'react';
import * as ReactNative from 'react-native';
import * as Themed from '../components/Themed';

const welcomeImage = require('../assets/images/welcomeImage.jpg');

export default function WelcomeScreen() {
  return (
    <ReactNative.ImageBackground
     source={Themed.welcomeBackground}
     style={Themed.styles.backgroundImage}
    >
      <ReactNative.Image
      source={welcomeImage}
      style={Themed.styles.welcomeImage}
      />
    </ReactNative.ImageBackground>
  );
}

const styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    //justifyContent: 'center',
  },
  tyron: {
    marginTop: 5,
    width: 350,
    height: 350,
  },
  slogan: {
    fontSize: 20,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  title: {
    margin: 30,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  separator: {
    marginVertical: 10,
    height: 1,
    width: '80%',
  },
});
