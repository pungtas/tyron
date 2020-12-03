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

import * as Scheme from 'tyronzil-sdk/dist/decentralized-identity/tyronZIL-schemes/did-scheme';
import * as DidResolver from 'tyronzil-sdk/dist/decentralized-identity/did-operations/did-resolve/resolver';
import * as TyronZIL from 'tyronzil-sdk/dist/blockchain/tyronzil';
import * as DidDocument from 'tyronzil-sdk/dist/decentralized-identity/did-operations/did-resolve/did-document';

const NETWORK = [
	'testnet',
	'mainnet'
];

const RESOLUTION_CHOICE = [
  'DID-Document',
  'DID-Resolution'
];

type RootParamList = {
  "Resolve": undefined;
  "Resolved": undefined
}

type LogInProps = ReactNavigation.StackScreenProps<RootParamList, "Resolve">

export default function ResolveTabScreen({ navigation }: LogInProps) {
  const [username, setUsername] = React.useState("");
  const [network, setNetwork] = React.useState(NETWORK);
  const [networkState, setNetworkState] = React.useState({ networkValue: null });
  const { networkValue } = networkState;
  const [resolution, setResolution] = React.useState(RESOLUTION_CHOICE);
  const [resolutionState, setResolutionState] = React.useState({ resolutionValue: null });
  const { resolutionValue } = resolutionState;
  let NETWORK_NAMESPACE: Scheme.NetworkNamespace;
  let INIT_TYRON: TyronZIL.InitTyron;
  
  return (
    <Themed.View style={Themed.styles.container}>
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
      <ReactNative.TextInput
        value = {username}
        style = {Themed.styles.inputText}
        placeholder = "Enter username.did"
        onChangeText = {username => {
          setUsername(username)
        }}
      />
      <Themed.View style={Themed.styles.separator} lightColor="#eee" darkColor="#008080" />
      <Submit
        title = {`Resolve ${username}`}
        onSubmission = {async() => {
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
          .then(async (did_resolved: any) => {
              alert!(JSON.stringify(did_resolved, null, 2));
              navigation.push('Resolved')
          })
          .catch((_err: any) => { navigation.push('Resolve') })          
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
