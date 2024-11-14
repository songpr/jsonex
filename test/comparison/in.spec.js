import tap from 'tap';
import jsonex from '../../index.js' 

tap.throws(() => jsonex.compile({ in: [1] }), "in operater: name's value is missing", "in operater: name's value is missing")
tap.throws(() => jsonex.compile({ in: {name:"abc"} }), "in operater: values's value is missing", "in operater: values's value is missing")
tap.throws(() => jsonex.compile({ in:  {name:"abc",values:[]}}), "in operater: values must be array with more than 1 value", "in operater: values must be array with more than 1 value")
const genderExp = jsonex.compile({ in:  {name:"gender",values:["male","female"]}});
tap.ok(genderExp.exec({ gender: "male" }), "gender is male")
tap.ok(genderExp.exec({ gender: "female" }), "gender is female")
tap.notOk(genderExp.exec({ gender: "18" }), '"18" is not in ["male","female"]')
tap.notOk(genderExp.exec({ gender: 10 }), '10 is not in ["male","female"]')
tap.notOk(genderExp.exec({ notage: 10 }), "no gender")
tap.notOk(genderExp.exec({ gender: null }), "gender is null")
tap.throws(() => genderExp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")