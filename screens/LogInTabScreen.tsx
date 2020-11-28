import * as ReactNative from 'react-native';
import * as React from 'react';

import * as Themed from '../components/Themed';
import * as ReactNavigation from '@react-navigation/stack';

import * as API from '@zilliqa-js/zilliqa';
import TyronZIL from '../src/tyronzil';

const ZILLIQA = new API.Zilliqa('https://dev-api.zilliqa.com/');
const INIT_TYRON = "0x63e2d8484187de4f66a571c098f3b51a793f055b";

type RootParamList = {
  "LogIn": undefined;
  "LoggedIn": undefined
}

type LogInProps = ReactNavigation.StackScreenProps<RootParamList, "LogIn">

export default function LogInTabScreen({ navigation }: LogInProps) {
  const [username, setUserName] = React.useState("");
  const [privateKey, setPrivateKey] = React.useState("");
  
  return (
    <Themed.View style={Themed.styles.container}>
      <Themed.Text style={Themed.styles.title}>Log into testnet:</Themed.Text>
      <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />  
      <ReactNative.TextInput
        value = {username}
        style = {Themed.styles.inputText}
        placeholder = "domain.did"
        onChangeText = {username => {
          setUserName(username)
        }}
      />
      <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
      <ReactNative.TextInput
        value = {privateKey}
        style = {Themed.styles.inputText}
        placeholder = "private key"
        onChangeText = {privateKey => {
          setPrivateKey(privateKey)
        }}
      />
      <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
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
    </Themed.View>
  );
}

function Submit({ title, onSubmission }: { title: any, onSubmission: any }) {
  return <ReactNative.TouchableOpacity onPress={onSubmission} style={Themed.styles.button}>
  <Themed.Text style={Themed.styles.buttonText}>{title}</Themed.Text>
  </ReactNative.TouchableOpacity>
}
