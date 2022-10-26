import tap from 'tap';
import jsonex from '../index.js';
tap.throws(() => { jsonex.compile(null) }, Error("support only JSON format/object"), "not support null")
tap.throws(() => { jsonex.compile({}) }, Error("not support empty JSON"), "not support empty object")
tap.throws(() => { jsonex.compile({ method: () => "ok" }) }, Error("not support empty JSON"), "not support empty object")
tap.throws(() => { jsonex.compile({ method: async () => "ok" }) }, Error("not support empty JSON"), "not support empty object")
tap.throws(() => {
    const val100ex = jsonex.compile({ value: 100 })
    val100ex.exec = () => 100
}, TypeError("Cannot add property exec, object is not extensible"), "not support empty object")
tap.throws(() => {
    const val100ex = jsonex.compile({ value: 100 })
    val100ex.isValue = false
}, TypeError("Cannot set property isValue of #<JSONexpression> which has only a getter"), "try to change is Value")