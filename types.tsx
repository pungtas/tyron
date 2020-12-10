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

import * as DidDocument from 'tyronzil-sdk/dist/decentralized-identity/did-operations/did-resolve/did-document';

export type RootStackParamList = {
  Root: undefined;
  Welcome: undefined;
  NotFound: undefined;
};

export type BottomTabParamList = {
  Welcome: undefined;
  'DID browser': undefined;
};

export type WelcomeTabParamList = {
  WelcomeTabScreen: undefined;
};

export type ResolverTabParamList = {
  Resolve: undefined;
  Resolved: { paramA: string, paramB: DidDocument.ResolutionResult | DidDocument.default }
};
