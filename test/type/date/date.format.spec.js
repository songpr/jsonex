import tap from 'tap'
import jsonex from '../../../index.js'
tap.throws(() => { jsonex.compile({ type: "date.format" }) }, Error('Invalid operator "type"'), "type must have other property")

const jsondate = { date: "2022-10-26" }

//tap.equal(jsonex.compile({ type: "date.format", value: "2022-10-26 12:00:01", format: "dd MMMM YYYY" }).exec({}),"26 October 2022","null==1970-01-01T00:00:00Z > $now?")