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

import * as ReactNative from 'react-native';
import * as React from 'react';

import * as Themed from '../components/Themed';
import * as ReactNavigation from '@react-navigation/stack';

import * as API from '@zilliqa-js/zilliqa';
import TyronZIL from '../src/tyronzil';
import * as Scheme from 'tyronzil-js/dist/src/lib/decentralized-identity/tyronZIL-schemes/did-scheme';
import RadioButton from '../components/RadioButton';

const NETWORK = [
	{
		key: 'testnet',
		text: 'testnet',
	},
	{
		key: 'mainnet',
		text: 'mainnet',
	}
];

const ZILLIQA = new API.Zilliqa('https://dev-api.zilliqa.com/');
const INIT_TYRON = "0x63e2d8484187de4f66a571c098f3b51a793f055b";

type RootParamList = {
  "Resolve": undefined;
  "Resolved": undefined
}

type LogInProps = ReactNavigation.StackScreenProps<RootParamList, "Resolve">

export default function ResolveTabScreen({ navigation }: LogInProps) {
  const [username, setUserName] = React.useState("");

  return (
    <Themed.View style={Themed.styles.container}>
      <RadioButton PROP={NETWORK} />
      <ReactNative.TextInput
        value = {username}
        style = {Themed.styles.inputText}
        placeholder = "Enter username.did"
        onChangeText = {username => {
          setUserName(username)
        }}
      />
      <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
      <Submit
        title = {`Resolve ${username}`}
        onSubmission = {async() => {
          const didcAddr = await TyronZIL.getDidAddr(ZILLIQA, INIT_TYRON, username);
          if(typeof didcAddr === "string"){
            if(login instanceof TyronZIL){
              navigation.push("Resolved")
            } else {
              navigation.push("Resolve")            
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
