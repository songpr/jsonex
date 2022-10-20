/**
 * Instantiate a JSONexpression to represent an expression in JSON format
 */
class JSONexpression {
    constructor(jsonExpression) {
        this._exp = JSONexpression.#compile(jsonExpression);
    }
    /**
     * 
     * @param {*} jsonData 
     * @returns 
     */
    execute(jsonData) {
        return this._exp(jsonData);
    }

    static #compile(jsonexp) {
        return (jsonData) => {
            return "Hello World"
        }
    }

    static compile(jsonexp) {
        return new JSONexpression(jsonexp)
    }
}



export { JSONexpression as jsonex };