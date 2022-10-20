import tap from 'tap';
import { jsonex } from '../../index.js';
const age18Exp = jsonex.compile({ "equal": [{ "name": "age" }, 18] });
tap.ok(age18Exp.exec({}), { age: 18 }, "age 18")
tap.notOk(age18Exp.exec({}), { age: 10 }, "age not 18")
