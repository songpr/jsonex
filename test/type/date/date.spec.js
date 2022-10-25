import tap from 'tap'
import jsonex from '../../../index.js'
tap.throws(() => { jsonex.compile({ type: "date" }) }, 'Invalid operator "type"', "type must have other property")
tap.throws(() => jsonex.compile({ type: "date" }), 'Invalid operator "type"', "value must be array length >= 2")

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

tap.notOk(jsonex.compile({ "less": [{ type: "date", "name": "expire_date" }, { type: "date", value: "$today" }] }).exec({}), "expire_date undefined always false, less")
tap.notOk(jsonex.compile({ "equal": [{ type: "date", "name": "expire_date" }, { type: "date", value: "$today" }] }).exec({}), "expire_date undefined always false, less")
tap.ok(jsonex.compile({ "lessOrEqual": [{ type: "date", "value": "$today" }, { type: "date", value: "$now" }] }).exec({}), "$today <= $now")
tap.ok(jsonex.compile({ "less": [{ type: "date", "value": null }, { type: "date", value: "$now" }] }).exec({}), "null==1970-01-01T00:00:00Z < $now")
tap.notOk(jsonex.compile({ "greater": [{ type: "date", "value": null }, { type: "date", value: "$now" }] }).exec({}), "null==1970-01-01T00:00:00Z > $now?")