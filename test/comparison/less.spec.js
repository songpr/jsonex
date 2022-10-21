import tap from 'tap';
import { jsonex } from '../../index.js';
const ageLessThan18Exp = jsonex.compile({ "less": [{ "name": "age" }, 18] });
tap.ok(ageLessThan18Exp.exec({ age: 17 }), "age 17; 17<18")
tap.notOk(ageLessThan18Exp.exec({ age: 18 }), '18=18')
tap.notOk(ageLessThan18Exp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageLessThan18Exp.exec({ age: 20 }), "age 20; 20 > 18")
tap.notOk(ageLessThan18Exp.exec({ notage: 10 }), "no age")
tap.notOk(ageLessThan18Exp.exec({ age: null }), "age is null")
tap.throws(() => ageLessThan18Exp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageLess18LessAllowAge = jsonex.compile({ "less": [{ "name": "age" }, 18, { name: "allowAge" }] });
tap.ok(ageLess18LessAllowAge.exec({ age: 17, allowAge: 19 }), "age is 18 and allow age is 19; 17<18<19")
tap.notOk(ageLess18LessAllowAge.exec({ age: 18, allowAge: "18" }), "age is 18 but allow age is '18'")
tap.notOk(ageLess18LessAllowAge.exec({ age: 18, allowAge: null }), "age is 18 but allow age is null")
tap.notOk(ageLess18LessAllowAge.exec({ age: 18, allowAge: 25 }), "age is 18 and allow age is 25;18<18<25")
tap.notOk(ageLess18LessAllowAge.exec({}), "")
tap.throws(() => ageLess18LessAllowAge.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const nameIsSortedAscending = jsonex.compile({ less: [{ "name": "name1" }, { "name": "name2" }] })
tap.ok(nameIsSortedAscending.exec({ name1: "a", name2: "ab" }), "name1<name2")
tap.ok(nameIsSortedAscending.exec({ name1: "a1", name2: "ab" }), "name1<name2")
tap.notOk(nameIsSortedAscending.exec({ name1: "a", name2: 1 }), "different type alway false 'a'<1")
tap.notOk(nameIsSortedAscending.exec({ name1: "2", name2: 3 }), "different type alway false '2'<3")
