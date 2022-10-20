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

    static #verify(jsonexp) {
        if (jsonexp == null || typeof (jsonexp) !== "object") {
            throw Error("support only JSON format/object")
        }
        const dataProperties = []
        //copy and left only data
        const jsonEXP = JSON.parse(JSON.stringify(jsonexp))
        if (Object.getOwnPropertyNames(jsonEXP).length === 0) throw Error("not support empty JSON")
        return jsonEXP
    }
    /**
     * private compile function use in JSONexpression only
     * @param {*} jsonexp 
     * @returns 
     */
    static #compile(jsonexp) {
        const jsonEXP = this.#verify(jsonexp)
        return (jsonData) => {
            return "Hello World"
        }
    }


    static compile(jsonexp) {
        return new JSONexpression(jsonexp)
    }
}

export { JSONexpression as jsonex };