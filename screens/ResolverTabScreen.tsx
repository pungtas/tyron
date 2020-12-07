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
import * as NavigationStack from '@react-navigation/stack';
import * as Scheme from 'tyronzil-sdk/dist/decentralized-identity/tyronZIL-schemes/did-scheme';
import * as DidResolver from 'tyronzil-sdk/dist/decentralized-identity/did-operations/did-resolve/resolver';
import * as TyronZIL from 'tyronzil-sdk/dist/blockchain/tyronzil';
import * as DidDocument from 'tyronzil-sdk/dist/decentralized-identity/did-operations/did-resolve/did-document';
import { ResolverTabParamList } from '../types';
import { useFonts, Ubuntu_400Regular } from '@expo-google-fonts/ubuntu';
import { AppLoading } from 'expo';

const NETWORK = [
	'testnet',
	'mainnet'
];

const RESOLUTION_CHOICE = [
  'DID-Document',
  'DID-Resolution'
];

const STATE = {
  loading: false
};

type Resolve = NavigationStack.StackScreenProps<ResolverTabParamList, "Resolve">
export function ResolveScreen({ navigation }: Resolve) {
  const [username, setUsername] = React.useState("");
  const [network, setNetwork] = React.useState(NETWORK);
  const [networkState, setNetworkState] = React.useState({ networkValue: null });
  const [resolution, setResolution] = React.useState(RESOLUTION_CHOICE);
  const [state, setState] = React.useState(STATE);

  const { networkValue } = networkState;
  const [resolutionState, setResolutionState] = React.useState({ resolutionValue: null });
  const { resolutionValue } = resolutionState;
  let NETWORK_NAMESPACE: Scheme.NetworkNamespace;
  let INIT_TYRON: TyronZIL.InitTyron;
  
  let [fontsLoaded] = useFonts({
    Ubuntu_400Regular
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  } else {
    return (
      <ReactNative.ImageBackground
        source={Themed.welcomeBackground}
        style={Themed.styles.backgroundImage}
      >
        <ReactNative.TextInput
          value = {username}
          style = {Themed.styles.inputText}
          placeholder = "Enter username.did"
          onChangeText = {username => {
            setUsername(username)
          }}
        />
        <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
        <Themed.View>
          {network.map((res: any) => {
            return (
              <ReactNative.View key={res} style={Themed.styles.container}>
                <ReactNative.Text style={Themed.styles.radioText}>{res}</ReactNative.Text>
                <ReactNative.TouchableOpacity
                  style={Themed.styles.radioCircle}
                  onPress={() => {
                    setNetworkState({
                      networkValue: res,
                    });
                    setNetwork(network);
                  }}>
                    { networkValue === res && <ReactNative.View style={Themed.styles.selectedRb} />}
                </ReactNative.TouchableOpacity>
              </ReactNative.View>
            );
          })}
        </Themed.View>
        <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
        <Themed.View>
          {resolution.map((res: any) => {
            return (
              <ReactNative.View key={res} style={Themed.styles.container}>
                <ReactNative.Text style={Themed.styles.radioText}>{res}</ReactNative.Text>
                <ReactNative.TouchableOpacity
                  style={Themed.styles.radioCircle}
                  onPress={() => {
                    setResolutionState({
                      resolutionValue: res,
                    });
                    setResolution(resolution);
                  }}>
                    { resolutionValue === res && <ReactNative.View style={Themed.styles.selectedRb} />}
                </ReactNative.TouchableOpacity>
              </ReactNative.View>
            );
          })}
        </Themed.View>
        <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
        <Submit
          title = {`Resolve ${username}`}
          state = {state}
          onSubmission = {async() => {
            setState({
              loading: true
            });

            switch (networkValue) {
              case 'testnet':
                NETWORK_NAMESPACE = Scheme.NetworkNamespace.Testnet;
                INIT_TYRON = TyronZIL.InitTyron.Testnet;
                break;
              case 'mainnet':
                NETWORK_NAMESPACE = Scheme.NetworkNamespace.Mainnet;
                INIT_TYRON = TyronZIL.InitTyron.Mainnet;
                break;
            };
            const DIDC_ADDR = await DidResolver.default.resolveDns(NETWORK_NAMESPACE, INIT_TYRON, username);
            
            let ACCEPT: DidDocument.Accept;
            switch (resolutionValue) {
                case 'DID-Document':
                    ACCEPT = DidDocument.Accept.contentType                
                    break;
                case 'DID-Resolution':
                    ACCEPT = DidDocument.Accept.Result
            };

            const RESOLUTION_INPUT: DidDocument.ResolutionInput = {
                didcAddr: DIDC_ADDR,
                metadata : {
                    accept: ACCEPT
                }
            };
            /** Resolves the Tyron DID */        
            await DidDocument.default.resolution(NETWORK_NAMESPACE, RESOLUTION_INPUT)
            .then(async did_resolved => {
                navigation.push('Resolved', { paramA: did_resolved })
            })
            .catch((_err: any) => { navigation.push('Resolve') })          
          }}
        />
      </ReactNative.ImageBackground>
    );
  }
}

function Submit({ title, onSubmission, state }: { title: any, onSubmission: any, state: any }) {
  return <ReactNative.TouchableOpacity onPress={onSubmission} style={Themed.styles.button}>
    <Themed.Text style={Themed.styles.buttonText}>{title}</Themed.Text>
    {
      state.loading &&
      <ReactNative.ActivityIndicator size="large" color="#00ff00" />
    }
  </ReactNative.TouchableOpacity>
}

type Resolved = NavigationStack.StackScreenProps<ResolverTabParamList, "Resolved">
export function ResolvedScreen({ navigation, route }: Resolved) {
  const DID_RESOLVED = route.params.paramA;
  return (
    <Themed.View style={Themed.styles.container}>
      { alert!(JSON.stringify(DID_RESOLVED, null, 2)) }
      <Submit
        title={`Go back to the resolver`}
        state={STATE}
        onSubmission={async() => {
          navigation.push("Resolve");
        }}
      />      
    </Themed.View>
  );
}
