export default class SmarUtil {
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
        let VALUE;
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
}
