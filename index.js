/**
 * Instantiate a JSONexpression to represent an expression in JSON format
 */
class JSONexpression {
    constructor(jsonExpression) {
        const { nodeProcessor, isAllValues } = JSONexpression.#compile(jsonExpression)
        this.#exp = nodeProcessor
        this.#isAllValues = isAllValues
    }
    #exp = null
    #isAllValues = true
    /**
     * 
     * @param {*} jsonData 
     * @returns 
     */
    exec(jsonData) {
        return this.#exp(jsonData);
    }

    get isValue() {
        return this.#isAllValues
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
     * 
     * @param {*} value 
     */
    static #isValue(value) {
        return value == null || typeof (value) !== "object"
    }
    static #nodeProcessorBuilder(node, parentResult) {
        const nodePropertyNames = Object.getOwnPropertyNames(node)
        const result = { nodeProcessor: null, isAllValues: true }
        Object.preventExtensions(result)//cannot add more property
        if (nodePropertyNames.length === 1) {
            const name = nodePropertyNames[0]//since it have only 1
            //check if the name is operator
            if (JSONexpression.operatorNames().indexOf(name) >= 0) {
                const nodeValue = node[name];
                switch (name) {
                    case "name":
                        if (typeof (nodeValue) !== "string") throw Error("name's value is missing")
                        result.nodeProcessor = (json) => {
                            if (json === null) throw Error("json data is null")
                            return json[nodeValue]
                        }
                        break
                    case "value":
                        if (typeof (nodeValue) === "object") throw Error("value operator support only native value")
                        result.nodeProcessor = () => {
                            //allow passing any json and return value
                            return nodeValue
                        }
                        break
                    case "equal":
                        if (Array.isArray(nodeValue) !== true || nodeValue.length < 2) throw Error("value for equal operator must be array with length more than 1")
                        const values = new Array(nodeValue.length)
                        for (let i = 0; i < values.length; i++) {
                            if (this.#isValue(nodeValue[i])) {
                                values[i] = nodeValue[i]
                            } else {
                                values[i] = this.#nodeProcessorBuilder(nodeValue[i], result)
                                if (result.isAllValues) result.isAllValues = false // a value is node
                                if (parentResult && parentResult.isAllValues) parentResult.isAllValues = false // a value is node
                            }
                        }
                        result.nodeProcessor = (json) => {
                            if (result.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                            let prevValue = null
                            for (let i = 0; i < values.length; i++) {
                                if (i > 0) {
                                    const currentValue = this.#isValue(values[i]) ? values[i] :
                                        values[i].nodeProcessor(json)
                                    if (currentValue !== prevValue) return false
                                    prevValue = currentValue //store current process value for next value
                                } else {
                                    prevValue = this.#isValue(values[i]) ? values[i] :
                                        values[i].nodeProcessor(json)
                                }
                            }
                            return true;
                        }
                        break;
                    default:
                        throw Error(`Invalid operator "${name}"`)
                }
            }
        }
        return result;
    }
    /**
     * private compile function use in JSONexpression only
     * @param {*} jsonexp 
     * @returns 
     */
    static #compile(json) {
        const jsonexp = JSONexpression.#verify(json)
        const node = jsonexp
        return this.#nodeProcessorBuilder(node)
    }

    static compile(jsonexp) {
        return new JSONexpression(jsonexp)
    }
}

export { JSONexpression as jsonex };