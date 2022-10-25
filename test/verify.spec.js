import tap from 'tap';
import jsonex from '../index.js';
tap.throws(() => { jsonex.compile(null) }, "support only JSON format/object", "not support null")
tap.throws(() => { jsonex.compile({}) }, "not support empty JSON", "not support empty object")
tap.throws(() => { jsonex.compile({ method: () => "ok" }) }, "not support empty JSON", "not support empty object")
tap.throws(() => { jsonex.compile({ method: async () => "ok" }) }, "not support empty JSON", "not support empty object")