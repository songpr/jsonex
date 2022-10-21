/**
 * Instantiate a JSONexpression to represent an expression in JSON format
 */
class JSONexpression {
    constructor(jsonExpression) {
        this._exp = JSONexpression.#compile(jsonExpression)
    }
    /**
     * 
     * @param {*} jsonData 
     * @returns 
     */
    exec(jsonData) {
        return this._exp(jsonData);
    }

    static #verify(json) {
        if (json == null || typeof (json) !== "object") {
            throw Error("support only JSON format/object")
        }
        //copy and left only data
        const jsonexp = JSON.parse(JSON.stringify(json))
        if (Object.getOwnPropertyNames(jsonexp).length === 0) throw Error("not support empty JSON")
        return jsonexp
    }
    static operatorNames() {
        return ["name", "value", "equal"]
    }
    /**
     * private compile function use in JSONexpression only
     * @param {*} jsonexp 
     * @returns 
     */
    static #compile(json) {
        const jsonexp = JSONexpression.#verify(json)
        const node = jsonexp
        const nodePropertyNames = Object.getOwnPropertyNames(jsonexp)
        let nodeProcessor = null;
        if (nodePropertyNames.length === 1) {
            const name = nodePropertyNames[0]//since it have only 1
            //check if the name is operator
            if (JSONexpression.operatorNames().indexOf(name) >= 0) {
                const value = node[name];
                switch (name) {
                    case "name":
                        if (typeof (value) !== "string") throw Error("name's value is missing")
                        nodeProcessor = (json) => {
                            if (json === null) throw Error("json data is null")
                            return json[value]
                        }
                        break
                    case "value":
                        if (typeof (value) === "object") throw Error("value operator support only native value")
                        nodeProcessor = (json) => {
                            return value
                        }
                        break
                    default:
                        throw Error(`Invalid operator ${name}`)
                }
            }
        }
        return nodeProcessor
    }

    static compile(jsonexp) {
        return new JSONexpression(jsonexp)
    }
}

export { JSONexpression as jsonex };