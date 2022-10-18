import tap from 'tap';
import { jsonex } from '../index.js';
const hiJsonexp = new jsonex({ type: "string", value: "Hello World" });
tap.equal(hiJsonexp.execute({}), "Hello World", "Hello World pass")
tap.equal(hiJsonexp.execute({name:"Song"}), "Hello World", "Hello World pass")