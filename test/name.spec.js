import tap from 'tap'
import jsonex from '../index.js'

const nameJsonexp = jsonex.compile({ name: "code" })
tap.equal(nameJsonexp.exec({ code: "Hello World" }), "Hello World", "reference JSON by a name of it's properties")
tap.throws(() => jsonex.compile({ name: null }), "name's value is missing", "name must be provided")