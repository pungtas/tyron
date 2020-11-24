import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from '../components/Themed';

const tyron = require('../assets/images/tyron.png');

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <Image source={tyron} style={styles.tyron}/> 
      <Text style={styles.slogan}>Own your data, empower your world!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text style={styles.title}>Your self-sovereign decentralized identity.did</Text>
    </View>
  );
}

const styles = StyleSheet.create({
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
