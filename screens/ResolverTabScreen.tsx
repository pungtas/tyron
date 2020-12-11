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

const NETWORK = ['testnet', 'mainnet'];

const RESOLUTION_CHOICE = ['with metadata'];

const STATE = { loading: false };

type Resolve = NavigationStack.StackScreenProps<ResolverTabParamList, "Resolve">
type Resolved = NavigationStack.StackScreenProps<ResolverTabParamList, "Resolved">

export default class Resolver extends React.Component {
  public static ResolveScreen({ navigation }: Resolve) {
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

    return (
      <ReactNative.ImageBackground
        source={Themed.resolverBackground}
        style={Themed.styles.image}
      >
        <ReactNative.View style={Themed.styles.resolverContainer}>
          <ReactNative.TextInput
            value = {username}
            style = {Themed.styles.inputText}
            placeholder = "Enter username.did"
            onChangeText = {username => {
              setUsername(username)
            }}
          />
          <ReactNative.Text style={Themed.styles.legend}>Zilliqa network:</ReactNative.Text>
          <Themed.View style={Themed.styles.options2}>
            {network.map((res: any) => {
              return (
                <ReactNative.View key={res} style={Themed.styles.options}>
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
                  <ReactNative.Text style={Themed.styles.radioText}>{res}</ReactNative.Text>
                </ReactNative.View>
              );
            })}
          </Themed.View>
          <ReactNative.Text style={Themed.styles.legend}>DID document:</ReactNative.Text>
          <Themed.View style={Themed.styles.options}>
            {resolution.map((res: any) => {
              return (
                <ReactNative.View key={res} style= {Themed.styles.options}>
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
                  <ReactNative.Text style={Themed.styles.radioText}>{res}</ReactNative.Text>
                </ReactNative.View>
              );
            })}
          </Themed.View>
          <Submit
            title = {`Search for ${username}`}
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
                  case 'with metadata':
                      ACCEPT = DidDocument.Accept.Result
                      break;
                  default:
                      ACCEPT = DidDocument.Accept.contentType                
                      break;
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
                  navigation.push('Resolved', { paramA: username, paramB: did_resolved })
              })
              .catch((_err: any) => { navigation.push('Resolve') })          
            }}
          />
        </ReactNative.View>
      </ReactNative.ImageBackground>
    );
  }

  public static ResolvedScreen({ route }: Resolved) {
    const USERNAME = route.params.paramA;
    const DID_RESOLVED = route.params.paramB;

    let RESULT = [];
    let DID_DOCUMENT: DidDocument.default;
    let RESOLUTION_METADATA: any;
    let METADATA: any;

    RESULT.push(['Decentralized Identifier', [DID_RESOLVED.id]]);
    if (DID_RESOLVED instanceof DidDocument.default) {
      DID_DOCUMENT = DID_RESOLVED;
    } else {
      DID_DOCUMENT = DID_RESOLVED.document;
      RESOLUTION_METADATA = DID_RESOLVED.resolutionMetadata;
      METADATA = DID_RESOLVED.metadata;
    }
    if(DID_DOCUMENT.publicKey) {
      RESULT.push(['General-purpose public key', [DID_DOCUMENT.publicKey.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.xsgdKey !== undefined) {
      RESULT.push(['$XSGD public key', [DID_DOCUMENT.xsgdKey.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.authentication !== undefined) {
      RESULT.push(['Authentication public key', [DID_DOCUMENT.authentication.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.assertionMethod !== undefined) {
      RESULT.push(['Assertion public key', [DID_DOCUMENT.assertionMethod.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.capabilityDelegation !== undefined) {
      RESULT.push(['Capability-delegation public key', [DID_DOCUMENT.capabilityDelegation.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.capabilityInvocation !== undefined) {
      RESULT.push(['Capability-invocation public key', [DID_DOCUMENT.capabilityInvocation.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.keyAgreement !== undefined) {
      RESULT.push(['Agreement public key', [DID_DOCUMENT.keyAgreement.publicKeyBase58]]);
    }
    if(DID_DOCUMENT.service !== undefined) {
      let SERVICES = [];
      for(let service of DID_DOCUMENT.service) {
        const HASH_INDEX = service.id.lastIndexOf("#");
        const ID = service.id.substring(HASH_INDEX+1);
        SERVICES.push([
          <ReactNative.Text style={Themed.styles.documentItem}>{ID}: </ReactNative.Text>,
          <ReactNative.Text 
          style={{color: 'blue'}}
          onPress={() => ReactNative.Linking.openURL(service.endpoint)}>
            {service.endpoint}
          </ReactNative.Text>
        ])
      }
      RESULT.push([`${USERNAME}'s services:`, SERVICES]);
    }
    if(RESOLUTION_METADATA !== undefined) {
      let INFO = [];
      const ds_epoch = RESOLUTION_METADATA.result.CurrentDSEpoch;
      INFO.push([
        <ReactNative.Text style={Themed.styles.documentItem}>DS block number: </ReactNative.Text>, ds_epoch
      ]);
      const sharding = JSON.stringify(RESOLUTION_METADATA.result.ShardingStructure.NumPeers, null);
      INFO.push([
        <ReactNative.Text style={Themed.styles.documentItem}>Blockchain sharding structure: </ReactNative.Text>, sharding
      ]);
      const node = RESOLUTION_METADATA.req.url;
      INFO.push([
        <ReactNative.Text style={Themed.styles.documentItem}>Node URL: </ReactNative.Text>, node
      ]);
      RESULT.push(['Resolution metadata', INFO]);
    }
    if(METADATA !== undefined) {
      let DID_METADATA = [];
      DID_METADATA.push([
        <ReactNative.Text style={Themed.styles.documentItem}>Update key: </ReactNative.Text>, METADATA.updateKey
      ]);
      DID_METADATA.push([
        <ReactNative.Text style={Themed.styles.documentItem}>Recovery key: </ReactNative.Text>, METADATA.recoveryKey
      ]);
      RESULT.push(['DID metadata:', DID_METADATA]);
    }

    return (
      <ReactNative.ImageBackground
        source={Themed.didNet}
        style={Themed.styles.image}
      >
        <Themed.View style={Themed.styles.resolvedContainer}>
          <ReactNative.ScrollView>
            <Themed.Text style={Themed.styles.title}>
              of {USERNAME}:
            </Themed.Text>
            <Themed.View style={Themed.styles.options3}>
            { RESULT.map((res: any) => {
              return(
                <ReactNative.View key={res} style={Themed.styles.document}>
                  <ReactNative.Text style={Themed.styles.documentLegend}>{res[0]}</ReactNative.Text>
                  { res[1].map((element: any) => {
                      return(
                        <ReactNative.Text style={Themed.styles.documentDescription}>{element}</ReactNative.Text>
                      );
                    })}
                </ReactNative.View>
              );
            })}
            </Themed.View> 
        </ReactNative.ScrollView>
        </Themed.View>
      </ReactNative.ImageBackground>
    );
  }
  
}

function Submit({ title, onSubmission, state }: { title: any, onSubmission: any, state: any }) {
  return <ReactNative.TouchableOpacity onPress={onSubmission} style={Themed.styles.button}>
    <Themed.Text style={Themed.styles.buttonText}>{title}</Themed.Text>
    {
      state.loading &&
      <ReactNative.ActivityIndicator size="large" color="#000" />
    }
  </ReactNative.TouchableOpacity>
}
