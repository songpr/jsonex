import { DateTime } from "luxon"
/**
 * Instantiate a JSONexpression to represent an expression in JSON format
 */
class JSONexpression {
    constructor(jsonExpression) {
        const { process, isAllValues } = JSONexpression.#compile(jsonExpression)
        this.#exp = process
        this.#isAllValues = isAllValues
        Object.freeze(this)
    }
    #exp = null
    #isAllValues = true
    /**
     * 
     * @param {*} jsonData 
     * @returns 
     */
    exec(jsonData) {
        if (jsonData === undefined) return this.#exp();
        const jsonCloneData = JSON.parse(JSON.stringify(jsonData))
        return this.#exp(jsonCloneData);
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
                        nameRefBuilder(nodeValue, nodeProcessor, parentNodeProcessor)
                        break
                    case "value":
                        valueProcessBuilder(nodeValue, nodeProcessor)
                        break
                    case "equal":
                        verifyValueForOperatorsRequireArray(name, nodeValue, 2)
                        const equalValues = processArrayValues(nodeValue, nodeProcessor, parentNodeProcessor)
                        nodeProcessor.process = (json) => {
                            if (node.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                            let prevValue = null
                            for (let i = 0; i < equalValues.length; i++) {
                                if (i > 0) {
                                    const currentValue = JSONexpression.#isValue(equalValues[i]) ? equalValues[i] :
                                        equalValues[i].process(json)
                                    if (prevValue instanceof DateTime) {
                                        if (!prevValue.equals(currentValue)) return false
                                    } else {
                                        if (prevValue !== currentValue) return false
                                    }

                                    prevValue = currentValue //store current process value for next value
                                } else {
                                    prevValue = JSONexpression.#isValue(equalValues[i]) ? equalValues[i] :
                                        equalValues[i].process(json)
                                }
                            }
                            return true;
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
                            if (typeof (nodeValue) === "boolean") {
                                nodeProcessor.process = () => !nodeValue
                                break;
                            }
                            throw Error('"not" operator support only boolean type value')
                        } else {
                            //nested node so create nodeProcessor and passing this nodeProcessor as parentNodeProcessor
                            const valueProcessor = JSONexpression.#nodeProcessorBuilder(nodeValue, nodeProcessor)
                            nodeProcessor.process = (json) => {
                                if (nodeProcessor.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
                                const result = valueProcessor.process(json)
                                return typeof (result) === "boolean" ? !result : false // if result is not of type boolean always return false
                            }
                        }
                        break;
                    default:
                        throw Error(`Invalid operator "${name}"`)
                }

            } else {
                throw Error(`Invalid operator "${name}"`)
            }
        } else if (nodePropertyNames.length > 1 && typeof (node.type) === "string") {
            //type conversion
            switch (node.type) {
                case "date":
                    dateProcessBuilder(node, nodeProcessor, parentNodeProcessor)
                    break
                default:
                    throw Error(`Invalid type "${node.type}"`)
            }
        } else {
            throw Error(`Invalid JSON expression '${JSON.stringify(node)}'`)
        }
        return nodeProcessor;


        function verifyValueForOperatorsRequireArray(operator, nodeValue, minLength) {
            if (Array.isArray(nodeValue) !== true || nodeValue.length < minLength) throw Error(`value for "${operator}" operator must be array with length at least ${minLength}`)
        }
        /**
         * comparison processor will process from left to right of values base on processor
         * @param {*} processor, processor function will process pair of values and return true or false
         * @param {*} values, array of values
         * @param {*} nodeProcessor, 
         * @returns 
         */
        function comparisonProcessor(json, processor, values, nodeProcessor) {
            if (nodeProcessor.isAllValues === false && (json == null || typeof (json) != "object")) throw Error("null is not support on non value JSON expression")
            let prevValue = null
            for (let i = 0; i < values.length; i++) {
                if (i > 0) {
                    const currentValue = JSONexpression.#isValue(values[i]) ? values[i] :
                        values[i].process(json)
                    if (currentValue === null || prevValue === null || typeof (currentValue) !== typeof (prevValue)) return false
                    if (processor(prevValue, currentValue) === false) return false
                    prevValue = currentValue //store current process value for next value
                } else {
                    prevValue = JSONexpression.#isValue(values[i]) ? values[i] :
                        values[i].process(json)
                }
            }
            return true;
        }

        function processArrayValues(nodeValue, nodeProcessor) {
            const values = new Array(nodeValue.length)
            for (let i = 0; i < values.length; i++) {
                if (JSONexpression.#isValue(nodeValue[i])) {
                    values[i] = nodeValue[i]
                } else {
                    //nested node so create nodeProcessor and passing this nodeProcessor as parentNodeProcessor
                    values[i] = JSONexpression.#nodeProcessorBuilder(nodeValue[i], nodeProcessor)
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

function valueProcessBuilder(nodeValue, nodeProcessor) {
    if (typeof (nodeValue) === "object")
        throw Error("value operator support only native value")
    nodeProcessor.process = () => {
        //allow passing any json and return value
        return nodeValue
    }
}

function nameRefBuilder(nodeValue, nodeProcessor, parentNodeProcessor) {
    if (typeof (nodeValue) !== "string")
        throw Error("name's value is missing")
    nodeProcessor.isAllValues = false
    if (parentNodeProcessor)
        parentNodeProcessor.isAllValues = false
    nodeProcessor.process = (json) => {
        if (json === null)
            throw Error("json data is null")
        return json[nodeValue] === undefined ? null : json[nodeValue]
    }
}
function dateProcessBuilder(node, nodeProcessor, parentNodeProcessor) {
    if (node.name !== undefined) {
        nameRefBuilder(node.name, nodeProcessor, parentNodeProcessor)
        if (typeof (nodeProcessor.process) === "function") {
            const nameRefProcess = nodeProcessor.process
            nodeProcessor.process = (json) => {
                const dateValue = nameRefProcess(json)
                //do not throw error on invalid datetime value such as undefined, "not a date" etc, but when compare it will always false since it's invalid date
                //null treat as undefined => invalid date
                const datetime = dateValue == null ? DateTime.fromISO(undefined) : DateTime.fromISO(dateValue)
                return datetime
            }
        }
    } else if (node.value !== undefined) {
        switch (node.value) {
            case "$today":
                //remove hours
                nodeProcessor.process = () => {
                    const today = DateTime.now().startOf("day")
                    return today
                }
                break
            case "$now":
                nodeProcessor.process = () => DateTime.now()
                break
            default:
                if (node.value === null || node.value === undefined) {
                    const invalidDate = DateTime.fromISO(undefined)
                    nodeProcessor.process = () => (invalidDate)
                    break;
                }
                const datetime = DateTime.fromISO(node.value)
                //other than null/undefined will throw compile time error
                if (!datetime.isValid)
                    throw Error(`Invalid datetime value "${node.value}", ${datetime.invalidReason}`) //throw invalid datetime value on compile time

                //if node.value = null date will "1970-01-01T00:00:00.000Z"
                nodeProcessor.process = () => (datetime)
                break
        }

    }
}

export default JSONexpression;
