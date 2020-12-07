/*
    tyronzil-sdk: Tyron DID SDK - Zilliqa's DID-Method at www.tyronZIL.com
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

/** Tools to manage smart contracts */
export default class SmartUtil {

    /** Gets the value out of a DIDC field Option */
    public static async getValue(object: any): Promise<string> {
        const ENTRIES = Object.entries(object);
        let VALUE: string;
        ENTRIES.forEach((value: [string, unknown]) => {
            if (value[0] === "arguments") {
                VALUE = value[1] as string;
            }
        });
        return VALUE![0];
    }

    /** Gets the DID-Status out of a DIDC field Option */
    public static async getStatus(object: any): Promise<string> {
        const ENTRIES = Object.entries(object);
        let VALUE: string;
        ENTRIES.forEach((value: [string, unknown]) => {
            if (value[0] === "constructor") {
                VALUE = value[1] as string;
            }
        });
        return VALUE!;
    }

    /** Gets the value out of a map key */
    public static async getValuefromMap(object: any, key: string): Promise<any> {
        const ENTRIES = Object.entries(object);
        let VALUE: unknown;
        ENTRIES.forEach((value: [string, unknown]) => {
            if (value[0] === key) {
                VALUE = value[1]
            }
        });
        return VALUE;
    }

    /** Turns the smart contract's map into a Map */
    public static async intoMap(object: any): Promise<Map<string, any>> {
        const ENTRIES = Object.entries(object);
        let MAP = new Map();
        ENTRIES.forEach((value: [string, unknown]) => {
            MAP.set(value[0], value[1])
        });
        return MAP;
    }

    /** Turns the DIDC `services` map field into a Map */
    public static async fromServices(object: any): Promise<Map<string, [string, string]>> {
        const PREV_MAP = await this.intoMap(object);
        let MAP = new Map();
        
        for (let id of PREV_MAP.keys()) {
            const OBJECT = PREV_MAP.get(id);
            const ENTRIES = Object.entries(OBJECT);
            
            ENTRIES.forEach((value: [string, unknown]) => {
                if (value[0] === "arguments") {
                    const VALUE = value[1] as [string, string];
                    const TYPE = VALUE[0];
                    const URI = VALUE[1];
                    MAP.set(id, [TYPE, URI]);
                }
            });

        };
        return MAP;
    }
}
