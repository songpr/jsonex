class JSONexpression{constructor(jsonExpression){var{process:jsonExpression,isAllValues}=JSONexpression.#compile(jsonExpression);this.#exp=jsonExpression,this.#isAllValues=isAllValues}#exp=null;#isAllValues=!0;exec(jsonData){return this.#exp(jsonData)}get isValue(){return this.#isAllValues}static#verify(json){if(null==json||"object"!=typeof json)throw Error("support only JSON format/object");json=JSON.parse(JSON.stringify(json));if(0===Object.getOwnPropertyNames(json).length)throw Error("not support empty JSON");return json}static operatorNames(){return["name","value","equal","less","greater","lessOrEqual","greaterOrEqual","and","or","not"]}static#isValue(value){return null==value||"object"!=typeof value}static#nodeProcessorBuilder(node,parentNodeProcessor){var nodePropertyNames=Object.getOwnPropertyNames(node);const nodeProcessor={process:null,isAllValues:!0};if(Object.preventExtensions(nodeProcessor),1===nodePropertyNames.length){var name=nodePropertyNames[0];if(0<=JSONexpression.operatorNames().indexOf(name)){const nodeValue=node[name];switch(name){case"name":if("string"!=typeof nodeValue)throw Error("name's value is missing");nodeProcessor.isAllValues=!1,parentNodeProcessor&&(parentNodeProcessor.isAllValues=!1),nodeProcessor.process=json=>{if(null===json)throw Error("json data is null");return json[nodeValue]};break;case"value":if("object"==typeof nodeValue)throw Error("value operator support only native value");nodeProcessor.process=()=>nodeValue;break;case"equal":verifyValueForOperatorsRequireArray(name,nodeValue,2);const equalValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>comparisonProcessor(json,(prevValue,currentValue)=>prevValue===currentValue,equalValues,nodeProcessor);break;case"less":verifyValueForOperatorsRequireArray(name,nodeValue,2);const lessValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>comparisonProcessor(json,(prevValue,currentValue)=>prevValue<currentValue,lessValues,nodeProcessor);break;case"greater":verifyValueForOperatorsRequireArray(name,nodeValue,2);const greaterValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>comparisonProcessor(json,(prevValue,currentValue)=>currentValue<prevValue,greaterValues,nodeProcessor);break;case"lessOrEqual":verifyValueForOperatorsRequireArray(name,nodeValue,2);const lessOrEqualValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>comparisonProcessor(json,(prevValue,currentValue)=>prevValue<=currentValue,lessOrEqualValues,nodeProcessor);break;case"greaterOrEqual":verifyValueForOperatorsRequireArray(name,nodeValue,2);const greaterOrEqualValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>comparisonProcessor(json,(prevValue,currentValue)=>currentValue<=prevValue,greaterOrEqualValues,nodeProcessor);break;case"and":verifyValueForOperatorsRequireArray(name,nodeValue,2);const andValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>{if(!1===nodeProcessor.isAllValues&&(null==json||"object"!=typeof json))throw Error("null is not support on non value JSON expression");for(let i=0;i<andValues.length;i++){var currentValue=JSONexpression.#isValue(andValues[i])?andValues[i]:andValues[i].process(json);if(null==currentValue||"boolean"!=typeof currentValue)return!1;if(!1===currentValue)return!1}return!0};break;case"or":verifyValueForOperatorsRequireArray(name,nodeValue,2);const orValues=processArrayValues(nodeValue,nodeProcessor);nodeProcessor.process=json=>{if(!1===nodeProcessor.isAllValues&&(null==json||"object"!=typeof json))throw Error("null is not support on non value JSON expression");for(let i=0;i<orValues.length;i++){var currentValue=JSONexpression.#isValue(orValues[i])?orValues[i]:orValues[i].process(json);if(null==currentValue||"boolean"!=typeof currentValue)return!1;if(!0===currentValue)return!0}return!1};break;case"not":if(Array.isArray(nodeValue))throw Error(`Array value is not support by "${name}" operator`);if(JSONexpression.#isValue(nodeValue)){if("boolean"!=typeof nodeValue)throw Error('"not" operator support only boolean type value');nodeProcessor.process=()=>!nodeValue}else{const valueProcessor=JSONexpression.#nodeProcessorBuilder(nodeValue,nodeProcessor);nodeProcessor.process=json=>{if(!1!==nodeProcessor.isAllValues||null!=json&&"object"==typeof json)return"boolean"==typeof(json=valueProcessor.process(json))&&!json;throw Error("null is not support on non value JSON expression")}}break;default:throw Error(`Invalid operator "${name}"`)}}}return nodeProcessor;function verifyValueForOperatorsRequireArray(operator,nodeValue,minLength){if(!0!==Array.isArray(nodeValue)||nodeValue.length<minLength)throw Error(`value for "${operator}" operator must be array with length at least `+minLength)}function comparisonProcessor(json,processor,values,node){if(!1===node.isAllValues&&(null==json||"object"!=typeof json))throw Error("null is not support on non value JSON expression");let prevValue=null;for(let i=0;i<values.length;i++)if(0<i){var currentValue=JSONexpression.#isValue(values[i])?values[i]:values[i].process(json);if(null==currentValue||null==prevValue||typeof currentValue!=typeof prevValue)return!1;if(!1===processor(prevValue,currentValue))return!1;prevValue=currentValue}else prevValue=JSONexpression.#isValue(values[i])?values[i]:values[i].process(json);return!0}function processArrayValues(nodeValue,nodeProcessor){var values=new Array(nodeValue.length);for(let i=0;i<values.length;i++)JSONexpression.#isValue(nodeValue[i])?values[i]=nodeValue[i]:values[i]=JSONexpression.#nodeProcessorBuilder(nodeValue[i],nodeProcessor);return values}}static#compile(json){json=JSONexpression.#verify(json);return this.#nodeProcessorBuilder(json)}static compile(jsonexp){return new JSONexpression(jsonexp)}}export default JSONexpression;