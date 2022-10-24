/**
 * Instantiate a JSONexpression to represent an expression in JSON format
 */
class JSONexpression {
    constructor(jsonExpression) {
        const { process, isAllValues } = JSONexpression.#compile(jsonExpression)
        this.#exp = process
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

    /**
     * return true, if expression return as constant native value
     */
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
        return ["name", "value", "equal", "less", "greater", "lessOrEqual", "greaterOrEqual", "and", "or", "not"]
    }
    /**
     * 
     * @param {*} value 
     */
    static #isValue(value) {
        return value == null || typeof (value) !== "object"
    }
    static #nodeProcessorBuilder(node, parentNodeProcessor) {
        const nodePropertyNames = Object.getOwnPropertyNames(node)
        const nodeProcessor = { process: null, isAllValues: true }
        Object.preventExtensions(nodeProcessor)//cannot add more property
        if (nodePropertyNames.length === 1) {
            const name = nodePropertyNames[0]//since it have only 1
            //check if the name is operator
            if (JSONexpression.operatorNames().indexOf(name) >= 0) {
                const nodeValue = node[name];
                switch (name) {
                    case "name":
                        if (typeof (nodeValue) !== "string") throw Error("name's value is missing")
                        nodeProcessor.process = (json) => {
                            if (json === null) throw Error("json data is null")
                            return json[nodeValue]
                        }
                        break
                    case "value":
                        if (typeof (nodeValue) === "object") throw Error("value operator support only native value")
                        nodeProcessor.process = () => {
                            //allow passing any json and return value
                            return nodeValue
                        }
                        break
                    case "equal":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const equalValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            return comparisonProcessor(json, (prevValue, currentValue) => prevValue === currentValue, equalValues, nodeProcessor)
                        }
                        break;
                    case "less":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const lessValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            return comparisonProcessor(json, (prevValue, currentValue) => prevValue < currentValue, lessValues, nodeProcessor)
                        }
                        break;
                    case "greater":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const greaterValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            return comparisonProcessor(json, (prevValue, currentValue) => prevValue > currentValue, greaterValues, nodeProcessor)
                        }
                        break;
                    case "lessOrEqual":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const lessOrEqualValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            return comparisonProcessor(json, (prevValue, currentValue) => prevValue <= currentValue, lessOrEqualValues, nodeProcessor)
                        }
                        break;
                    case "greaterOrEqual":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const greaterOrEqualValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            return comparisonProcessor(json, (prevValue, currentValue) => prevValue >= currentValue, greaterOrEqualValues, nodeProcessor)
                        }
                        break;
                    case "and":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const andValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            if (nodeProcessor.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                            for (let i = 0; i < andValues.length; i++) {
                                const currentValue = JSONexpression.#isValue(andValues[i]) ? andValues[i] :
                                    andValues[i].process(json)
                                if (currentValue == null || typeof (currentValue) !== "boolean") return false
                                if (currentValue === false) return false
                            }
                            return true
                        }
                        break;
                    case "or":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const orValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            if (nodeProcessor.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                            for (let i = 0; i < orValues.length; i++) {
                                const currentValue = JSONexpression.#isValue(orValues[i]) ? orValues[i] :
                                    orValues[i].process(json)
                                if (currentValue == null || typeof (currentValue) !== "boolean") return false
                                if (currentValue === true) return true
                            }
                            return false
                        }
                        break;
                    case "not":
                        if (Array.isArray(nodeValue)) throw Error(`Array value is not support by "${name}" operator`)
                        if (JSONexpression.#isValue(nodeValue)) {
                            if (typeof (nodeValue) === "boolean") nodeProcessor.process = () => !nodeValue
                            throw Error('"not" operator support only boolean type value')
                        } else {
                            //nested node so create nodeProcessor and passing this nodeProcessor as parentNodeProcessor
                            const valueProcessor = JSONexpression.#nodeProcessorBuilder(nodeValue, nodeProcessor)
                            if (nodeProcessor.isAllValues)
                                nodeProcessor.isAllValues = false // a value is node
                            if (parentNodeProcessor && parentNodeProcessor.isAllValues)
                                parentNodeProcessor.isAllValues = false // a value is node
                            nodeProcessor.process = (json) => {
                                if (nodeProcessor.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                                const result = valueProcessor(json)
                                return typeof (result) === "boolean" ? !result : false // if result is not of type boolean always return false
                            }
                        }
                        break;
                    default:
                        throw Error(`Invalid operator "${name}"`)
                }
            }
        }
        return nodeProcessor;
        function verifyValueForOperatorsRequireArray(operator, nodeValue, minLength) {
            if (Array.isArray(nodeValue) !== true || nodeValue.length < minLength) throw Error(`value for "${operator}" operator must be array with length at least ${minLength}`)
        }
        /**
         * comparison processor will process from left to right of values base on processor
         * @param {*} processor, processor function will process pair of values and return true or false
         * @param {*} values, array of values
         * @param {*} node, 
         * @returns 
         */
        function comparisonProcessor(json, processor, values, node) {
            if (node.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
            let prevValue = null
            for (let i = 0; i < values.length; i++) {
                if (i > 0) {
                    const currentValue = JSONexpression.#isValue(values[i]) ? values[i] :
                        values[i].process(json)
                    if (currentValue == null || prevValue == null || typeof (currentValue) !== typeof (prevValue)) return false
                    if (processor(prevValue, currentValue) === false) return false
                    prevValue = currentValue //store current process value for next value
                } else {
                    prevValue = JSONexpression.#isValue(values[i]) ? values[i] :
                        values[i].process(json)
                }
            }
            return true;
        }

        function processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor) {
            const values = new Array(nodeValue.length)
            for (let i = 0; i < values.length; i++) {
                if (JSONexpression.#isValue(nodeValue[i])) {
                    values[i] = nodeValue[i]
                } else {
                    //nested node so create nodeProcessor and passing this nodeProcessor as parentNodeProcessor
                    values[i] = JSONexpression.#nodeProcessorBuilder(nodeValue[i], nodeProcessor)
                    if (nodeProcessor.isAllValues)
                        nodeProcessor.isAllValues = false // a value is node
                    if (parentNodeProcessor && parentNodeProcessor.isAllValues)
                        parentNodeProcessor.isAllValues = false // a value is node
                }
            }
            return values
        }
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