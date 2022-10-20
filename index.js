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
    /**
     * private compile function use in JSONexpression only
     * @param {*} jsonexp 
     * @returns 
     */
    static #compile(json) {
        const jsonexp = this.#verify(json)
        return (jsonData) => {
            return "Hello World"
        }
    }


    static compile(jsonexp) {
        return new JSONexpression(jsonexp)
    }
}

export { JSONexpression as jsonex };