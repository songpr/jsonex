import tap from 'tap';
import { jsonex } from '../../index.js';
const age18Exp = jsonex.compile({ "equal": [{ "name": "age" }, 18] });
tap.ok(age18Exp.exec({ age: 18 }), "age 18")
tap.notOk(age18Exp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(age18Exp.exec({ age: 10 }), "age not 18")
tap.notOk(age18Exp.exec({ notage: 10 }), "no age")
tap.notOk(age18Exp.exec({ age: null }), "age is null")
tap.throws(() => age18Exp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const allowAge18 = jsonex.compile({ "equal": [{ "name": "age" }, { name: "allowAge" }, 18] });
tap.ok(allowAge18.exec({ age: 18, allowAge: 18 }), "age is 18 and allow age is 18")
tap.notOk(allowAge18.exec({ age: 18, allowAge: "18" }), "age is 18 but allow age is '18'")
tap.notOk(allowAge18.exec({ age: 18, allowAge: null }), "age is 18 but allow age is null")
tap.notOk(allowAge18.exec({ age: 18, allowAge: 25 }), "age is 18 but allow age is 25")
tap.notOk(allowAge18.exec({}), "")
tap.throws(() => allowAge18.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")
