import tap from 'tap'
import jsonex from '../../../index.js'
tap.throws(() => { jsonex.compile({ type: "date" }) }, 'Invalid operator "type"', "type must have other property")
tap.throws(() => jsonex.compile({ type: "date" }), 'Invalid operator "type"', "value must be valid ISO date string")
tap.throws(() => jsonex.compile({ type: "date", value: "2022-11-2" }), 'Invalid datetime value "2022-11-2", unparsable', "value must be valid ISO date string")

const notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp = jsonex.compile({
    and: [
        { "greater": [{ type: "date", "name": "expire_date" }, { type: "date", value: "$today" }] },
        {
            or: [
                { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
                { "name": "isPermittedByParent" }
            ]
        }
    ]
});
tap.ok(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ expire_date: "3000-01-01", age: 26, allowAge: 25, isPermittedByParent: false }), "expire_date>$today and (26>=allowAge or isPermittedByParent)")
tap.ok(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ expire_date: "3000-01-01", age: 18, allowAge: 25, isPermittedByParent: true }), "expire_date>$today and (18>=allowAge or isPermittedByParent)")
tap.notOk(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ expire_date: "2000-01-01", age: 18, allowAge: 25, isPermittedByParent: true }), "expire_date>$today and (18>=allowAge or isPermittedByParent)")
tap.notOk(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ expire_date: "abc", age: 18, allowAge: 25, isPermittedByParent: true }), "invalid expire_date always false")
tap.notOk(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 18, allowAge: 25, isPermittedByParent: true }), "expire_date undefined always false")
tap.notOk(notExpireYetAnd_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ expire_date: null, age: 18, allowAge: 25, isPermittedByParent: true }), "expire_date undefined always false")

tap.notOk(jsonex.compile({ "less": [{ type: "date", "name": "expire_date" }, { type: "date", value: "$today" }] }).exec({}), "expire_date undefined always false, less")
tap.notOk(jsonex.compile({ "equal": [{ type: "date", "name": "expire_date" }, { type: "date", value: "$today" }] }).exec({}), "expire_date undefined always false, less")
tap.ok(jsonex.compile({ "lessOrEqual": [{ type: "date", "value": "$today" }, { type: "date", value: "$now" }] }).exec({}), "$today <= $now")
tap.ok(jsonex.compile({ "less": [{ type: "date", "name": "past" }, { type: "date", value: "$today" }] }).exec({past:"2022-11-01 00:00:00"}), "past < $today")
tap.ok(jsonex.compile({ "greater": [{ type: "date", value: "$today" },{ type: "date", "name": "past" }] }).exec({past:"2022-11-01 00:00:00"}), "$today > past")
tap.notOk(jsonex.compile({ "less": [{ type: "date", "value": null }, { type: "date", value: "$now" }] }).exec({}), "null < $now, null/undefined always wrong as they are invalid datetime")
tap.notOk(jsonex.compile({ "greater": [{ type: "date", "value": null }, { type: "date", value: "$now" }] }).exec({}), "null > $now, null/undefined always wrong as they are invalid datetime")
const now = new Date()
const todayISO = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
tap.ok(jsonex.compile({ "equal": [{ type: "date", "name": "today" }, { type: "date", value: "$today" }] }).exec({ today: todayISO }), `date in format "yyyy-mm-dd" will treat as local date, "${todayISO}"`)
//
tap.notOk(jsonex.compile({ "equal": [{ type: "date", "value": "2022-11-02" }, { type: "date", name: "date" }] }).exec({ date: "2022-11-2" }), 'date compare to invalid date will always false')
tap.notOk(jsonex.compile({ "equal": [{ type: "date", "value": "2022-11-02" }, { value: now.getTime() }] }).exec({}), 'date compare to other type will always false')