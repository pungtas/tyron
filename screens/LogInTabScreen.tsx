import * as React from 'react';
import { StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import { Text, View } from '../components/Themed';
import { StackScreenProps } from '@react-navigation/stack';

import * as API from '@zilliqa-js/zilliqa';
import TyronZIL from '../src/tyronzil';

const ZILLIQA = new API.Zilliqa('https://dev-api.zilliqa.com/');
const INIT_TYRON = "0x63e2d8484187de4f66a571c098f3b51a793f055b";

type RootParamList = {
  "LogIn": undefined;
  "LoggedIn": undefined
}

type LogInProps = StackScreenProps<RootParamList, "LogIn">

export default function LogInTabScreen({ navigation }: LogInProps) {
  const [username, setUserName] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log into testnet:</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="#008080" />  
      <TextInput
        value = {username}
        style = {styles.inputText}
        placeholder = "domain.did"
        onChangeText = {username => {
          setUserName(username)
        }}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="#008080" />
      <TextInput
        value = {privateKey}
        style = {styles.inputText}
        placeholder = "private key"
        onChangeText = {privateKey => {
          setPrivateKey(privateKey)
        }}
      />
      <View style={styles.separator} lightColor="#eee" darkColor="#008080" />
      <Submit
        title = {`Log into ${username}`}
        onSubmission = {async() => {
          const didcAddr = await TyronZIL.resolve(ZILLIQA, INIT_TYRON, username);
          if(typeof didcAddr === "string"){
            const login = await TyronZIL.initialize(ZILLIQA, privateKey, username, didcAddr);
            if(login instanceof TyronZIL){
              navigation.push("LoggedIn")
            } else {
              navigation.push("LogIn")            
            }
          } else {
            alert!(didcAddr);
          }
          
        }}
      />      
    </View>
  );
}

function Submit({ title, onSubmission }) {
  return <TouchableOpacity onPress={onSubmission} style={styles.button}>
  <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: 30,
    backgroundColor: '#008080',
    padding: 10,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 30,
    color: '#fff',
  },
  inputText: {
    fontSize: 25,
    color: 'steelblue',
    marginBottom: 20,  
  },
});
