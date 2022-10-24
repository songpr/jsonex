import tap from 'tap';
import { jsonex } from '../../index.js';
const ageMoreThanOrEqual18Exp = jsonex.compile({ "greaterOrEqual": [{ "name": "age" }, 18] });
tap.ok(ageMoreThanOrEqual18Exp.exec({ age: 19 }), "age 17; 17<18")
tap.ok(ageMoreThanOrEqual18Exp.exec({ age: 18 }), '18=18')
tap.notOk(ageMoreThanOrEqual18Exp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageMoreThanOrEqual18Exp.exec({ age: 17 }), "age 17; 17 < 18")
tap.notOk(ageMoreThanOrEqual18Exp.exec({ notage: 10 }), "no age")
tap.notOk(ageMoreThanOrEqual18Exp.exec({ age: null }), "age is null")
tap.throws(() => ageMoreThanOrEqual18Exp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18 = jsonex.compile({ "greaterOrEqual": [{ "name": "age" }, { name: "allowAge" }, 18] });
tap.ok(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({ age: 20, allowAge: 19 }), "age is 20 and allow age is 19; 20>=19>=18")
tap.ok(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({ age: 20, allowAge: 18 }), "age is 20 and allow age is 19; 20>=18>=18")
tap.notOk(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({ age: 18, allowAge: "18" }), "age is 18 but allow age is '18'")
tap.notOk(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({ age: 18, allowAge: null }), "age is 18 but allow age is null")
tap.notOk(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({ age: 18, allowAge: 25 }), "age is 18 and allow age is 25;18<25>18")
tap.notOk(ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec({}), "")
tap.throws(() => ageGreaterThanOrEqualAllowAgeGreaterThanOrEqaul18.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const nameIsSortedAscending = jsonex.compile({ greaterOrEqual: [{ "name": "name2" }, { "name": "name1" }] })
tap.ok(nameIsSortedAscending.exec({ name1: "a", name2: "ab" }), "name2>=name1")
tap.ok(nameIsSortedAscending.exec({ name1: "a1", name2: "ab" }), "name2>=name1")
tap.ok(nameIsSortedAscending.exec({ name1: "ab", name2: "ab" }), "name2>=name1")
tap.notOk(nameIsSortedAscending.exec({ name1: "a", name2: null }), "comparison with null always false, right value null")
tap.notOk(nameIsSortedAscending.exec({ name1: null, name2: 1 }), "comparison with null always false, left value null")
tap.notOk(nameIsSortedAscending.exec({ name1: "a", name2: 1 }), "different type alway false 'a'>=1")
tap.notOk(nameIsSortedAscending.exec({ name1: "2", name2: 3 }), "different type alway false '2'>=3")
