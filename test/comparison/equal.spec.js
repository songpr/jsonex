import tap from 'tap';
import { jsonex } from '../../index.js';
const age18Exp = jsonex.compile({ "equal": [{ "name": "age" }, 18] });
tap.ok(age18Exp.exec({ age: 18 }), "age 18")
tap.notOk(age18Exp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(age18Exp.exec({ age: 10 }), "age not 18")
tap.throws(() => age18Exp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")