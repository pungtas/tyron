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
import * as API from '@zilliqa-js/zilliqa';
import * as zcrypto from '@zilliqa-js/crypto';
import * as Util from '@zilliqa-js/util';
import SmartUtil from './smart-util';

/** Operation types */
export enum OperationType {
    Create = "Created",
    Recover = "Recovered",
    Update = "Updated",
    Deactivate = "Deactivated"
}

export enum Accept {
    contentType = "application/did+json",        //requests a DID-Document as output
    Result = "application/did+json;profile='https://w3c-ccg.github.io/did-resolution'"        //requests a DID-Resolution-Result as output
}

/** The tyronZIL transaction class */
export default class TyronZIL {
    public readonly didcAddr: string;
    /** The user is the owner of their DIDC */
    public readonly contractOwner: string;
    public readonly userPrivateKey: string;

    public readonly gasPrice: Util.BN;
    public readonly gasLimit: Util.Long;

    private constructor(
        didcAddr: string,
        contractOwner: string,
        userPrivateKey: string,
        gasPrice: Util.BN,
        gasLimit: Util.Long,
    ) {
        this.didcAddr = didcAddr;
        this.contractOwner = contractOwner;
        this.userPrivateKey = userPrivateKey;
        this.gasPrice = gasPrice;
        this.gasLimit = gasLimit
    }

    public static async getDidAddr(zilliqa: API.Zilliqa, initTyron: string, username: string): Promise<void|string> {
        const DOT_INDEX = username.lastIndexOf(".");
        const SSI_DOMAIN = username.substring(DOT_INDEX);
        const AVATAR = username.substring(0, DOT_INDEX);
        if(SSI_DOMAIN !== ".did") {
          alert!("Only .did domain names are valid");
        } else {
            const DIDC_ADDRESS = await zilliqa.blockchain.getSmartContractState(initTyron)
            .then(async STATE => {
                return STATE.result.dns;
            })
            .then(async (dns: any) => {
                return await SmartUtil.getValuefromMap(dns, SSI_DOMAIN);
            })
            .then(async (resourceRecords: any) => {
                return await SmartUtil.getValuefromMap(resourceRecords, AVATAR);
            })
            .catch((err: any) => { alert!(err) });
            
            return zcrypto.toBech32Address(DIDC_ADDRESS);
        }
    }

    /** Resolves the tyron.did and saves it */
    public static async resolver(network: string, didcAddr: string, resolutionChoice: number): Promise<void> {
        let ACCEPT;
            switch (resolutionChoice) {
                case 1:
                    ACCEPT = Accept.contentType                
                    break;
                case 2:
                    ACCEPT = Accept.Result
                    break;
                default:
                    ACCEPT = Accept.contentType
                    break;
            }

            const RESOLUTION_INPUT = {
                didcAddr: didcAddr,
                metadata : {
                    accept: ACCEPT
                }
            }
            
            /** Resolves the Tyron DID */        
            return await DidDoc.resolution(network, RESOLUTION_INPUT)
            .catch((err: any) => { throw err })
    }
    
    /** Retrieves the minimum gas price & validates the account info */
    public static async tyronzilInit(
        zilliqa: API.Zilliqa,
        userPrivateKey: string,
        username: string,
        didcAddr: string
    ): Promise<void|TyronZIL> {
        try {
            let CONTRACT_OWNER = zcrypto.toBech32Address(zcrypto.getAddressFromPrivateKey(userPrivateKey));
            const state = await zilliqa.blockchain.getSmartContractState(didcAddr)
            .then(async didc_state => {
                const STATUS = await SmartUtil.getStatus(didc_state.result.did_status);
                switch (STATUS) {
                    case OperationType.Deactivate:
                        throw alert!("Error: The requested DID is deactivated");
                    default:
                        const STATE: State = {
                            contractOwner: zcrypto.toBech32Address(didc_state.result.contract_owner),
                            decentralized_identifier: String(didc_state.result.decentralized_identifier),
                            tyron_hash: await SmartUtil.getValue(didc_state.result.tyron_hash),
                            did_status: STATUS,
                            verification_methods: await SmartUtil.intoMap(didc_state.result.verification_methods)
                        };
                        return STATE;
                }
            })
            .catch(err => { throw err });
            const didc_state = state as State;
            if(CONTRACT_OWNER !== didc_state.contractOwner) {
                alert!(`The private key does not match the contract owner for ${username}`)
            } else {
            const GAS_LIMIT = new Util.Long(20000);
            const transaction_init = await zilliqa.blockchain.getMinimumGasPrice()
            .then(min_gas_price => {
                const GAS_PRICE = new Util.BN(min_gas_price.result!);
                
                return new TyronZIL(
                    zcrypto.fromBech32Address(didcAddr),
                    zcrypto.fromBech32Address(CONTRACT_OWNER),
                    zcrypto.normalizePrivateKey(userPrivateKey),
                    GAS_PRICE,
                    GAS_LIMIT               
                );
            })
            .catch(err => { alert!(err)});
            alert!(`Your login was successful! The address of your DID contract is ${didcAddr}`)
            return transaction_init;
            }
        } catch (error) {
            alert!(error)            
        }
    }

    /** Submits a tyronZIL transaction */
    public static async submit(
        tag: TransitionTag,
        zilliqa: API.Zilliqa,
        version: number,
        input: TyronZIL,
        params: TransitionParams[]
        ): Promise<void> {
        
            const AMOUNT = new Util.BN(0);
            const USER_PUBKEY = zcrypto.getPubKeyFromPrivateKey(input.userPrivateKey);
            
            const USER_BALANCE = await zilliqa.blockchain.getBalance(input.contractOwner)
            .then( async balance => {
       
            const TRANSITION: Transition = {
                _tag: tag,
                _amount: String(AMOUNT),
                _sender: input.contractOwner,
                params: params
            };

            const TX_OBJECT: TxObject = {
                version: version,
                amount: AMOUNT,
                nonce: Number(balance.result.nonce)+ 1,
                gasLimit: input.gasLimit,
                gasPrice: input.gasPrice,
                toAddr: input.didcAddr,
                pubKey: USER_PUBKEY,
                data: JSON.stringify(TRANSITION),
            };
            
            const RAW_TX = zilliqa.transactions.new(TX_OBJECT);
            return RAW_TX;
            
        })
        .then(async raw_tx  => {
            zilliqa.wallet.addByPrivateKey(input.userPrivateKey);
            
            const SIGNED_TX = await zilliqa.wallet.signWith(raw_tx, input.contractOwner);
            return SIGNED_TX;
        })
        .then(async signed_tx => {
            /** Sends the transaction to the Zilliqa blockchain platform */
            const TX = await zilliqa.blockchain.createTransaction(signed_tx, 33, 1000);
            return TX;
        })
        .then( async transaction => {
            const TRAN_ID = transaction.id!;
            
            const TRANSACTION = await transaction.confirm(TRAN_ID, 33, 1000)
            const STATUS = transaction.isConfirmed();
            if(STATUS){
                const TX_RECEIPT = transaction.getReceipt();
                const CUMULATIVE_GAS = TX_RECEIPT!.cumulative_gas;
                alert!(`The ${tag} tyronZIL transaction was successful! The total gas consumed was: ${CUMULATIVE_GAS}`);
            } else {
                alert!(`The ${tag} tyronZIL transaction was unsuccessful.`);
            }
            
            
        })
        .catch(err => { alert!(err)})
    }

    public static async xTransfer(
        campaign: string,
        agent: string,
        recipient: string,
        amount: string,
        signature: string
    ): Promise<TransitionParams[]> {
        
        const PARAMS = [];

        const CAMPAIGN: TransitionParams = {
            vname: 'domain',
            type: 'String',
            value: campaign,
        };
        PARAMS.push(CAMPAIGN);

        const TOKEN: TransitionParams = {
            vname: 'token',
            type: 'String',
            value: 'xsgd',
        };
        PARAMS.push(TOKEN);

        const AGENT: TransitionParams = {
            vname: 'agent',
            type: 'String',
            value: agent,
        };
        PARAMS.push(AGENT);

        const RECIPIENT: TransitionParams = {
            vname: 'to',
            type: 'ByStr20',
            value: recipient,
        };
        PARAMS.push(RECIPIENT);

        const AMOUNT: TransitionParams = {
            vname: 'amount',
            type: 'Uint128',
            value: amount,
        };
        PARAMS.push(AMOUNT);

        const SIGNATURE: TransitionParams = {
            vname: 'signature',
            type: 'ByStr64',
            value: signature,
        };
        PARAMS.push(SIGNATURE);

        return PARAMS;
    }
}

/***            ** interfaces **            ***/

interface Transition {
    _tag: string;               // transition to be invoked
    _amount: string; 	        // number of QA to be transferred
    _sender: string;	        // address of the invoker
    params: TransitionParams[] 	// an array of parameter objects
}

export enum TransitionTag {
    XTransfer = "XTransfer"
}

interface TransitionParams {
    vname: string;
    type: any;
    value: unknown;
}

interface TxObject {
    version: number;
    amount: Util.BN;
    nonce: number;
    gasLimit: Util.Long;
    gasPrice: Util.BN;
    toAddr: string;
    pubKey: string;
    code?: string;
    data?: string;
    priority?: boolean;
}

interface State {
    contractOwner: string;
    decentralized_identifier: string;
    tyron_hash: string;
    did_status: string;
    verification_methods: Map<string, any>,
}