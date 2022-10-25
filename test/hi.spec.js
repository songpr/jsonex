import tap from 'tap';
import jsonex from '../index.js';
const hiJsonexp = new jsonex({ value: "Hello World" });
tap.equal(hiJsonexp.exec({}), "Hello World", "Hello World pass")
tap.equal(hiJsonexp.exec({ name: "Song" }), "Hello World", "Hello World pass")


const helloJsonexp = jsonex.compile({ value: "Hello" });
tap.equal(helloJsonexp.exec({}), "Hello", "Hello pass")
tap.equal(helloJsonexp.exec({ name: "Song" }), "Hello", "Hello pass")