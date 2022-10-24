import tap from 'tap';
import { jsonex } from '../../index.js';
const ageMoreThan18Exp = jsonex.compile({ "greater": [{ "name": "age" }, 18] });
tap.ok(ageMoreThan18Exp.exec({ age: 19 }), "age 17; 17<18")
tap.notOk(ageMoreThan18Exp.exec({ age: 18 }), '18=18')
tap.notOk(ageMoreThan18Exp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageMoreThan18Exp.exec({ age: 17 }), "age 17; 17 < 18")
tap.notOk(ageMoreThan18Exp.exec({ notage: 10 }), "no age")
tap.notOk(ageMoreThan18Exp.exec({ age: null }), "age is null")
tap.throws(() => ageMoreThan18Exp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageGreaterThanAllowAgeGreaterThan18 = jsonex.compile({ "greater": [{ "name": "age" }, { name: "allowAge" }, 18] });
tap.ok(ageGreaterThanAllowAgeGreaterThan18.exec({ age: 20, allowAge: 19 }), "age is 20 and allow age is 19; 20>19>18")
tap.notOk(ageGreaterThanAllowAgeGreaterThan18.exec({ age: 18, allowAge: "18" }), "age is 18 but allow age is '18'")
tap.notOk(ageGreaterThanAllowAgeGreaterThan18.exec({ age: 18, allowAge: null }), "age is 18 but allow age is null")
tap.notOk(ageGreaterThanAllowAgeGreaterThan18.exec({ age: 18, allowAge: 25 }), "age is 18 and allow age is 25;18<25>18")
tap.notOk(ageGreaterThanAllowAgeGreaterThan18.exec({}), "")
tap.throws(() => ageGreaterThanAllowAgeGreaterThan18.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const nameIsSortedAscending = jsonex.compile({ greater: [{ "name": "name2" }, { "name": "name1" }] })
tap.ok(nameIsSortedAscending.exec({ name1: "a", name2: "ab" }), "name2>name1")
tap.ok(nameIsSortedAscending.exec({ name1: "a1", name2: "ab" }), "name2>name1")
tap.notOk(nameIsSortedAscending.exec({ name1: "a", name2: 1 }), "different type alway false 'a'<1")
tap.notOk(nameIsSortedAscending.exec({ name1: "2", name2: 3 }), "different type alway false '2'<3")
