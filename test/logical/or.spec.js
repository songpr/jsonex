import tap from 'tap';
import { jsonex } from '../../index.js';
tap.throws(() => { jsonex.compile({ or: [true] }) }, 'value for "or" operator must be array with length at least 2', "value must be array length >= 2")
tap.throws(() => jsonex.compile({ or: false }), 'value for "or" operator must be array with length at least 2', "value must be array length >= 2")

const trueExp = jsonex.compile({ or: [true, false] });
tap.ok(trueExp.exec(), "check true")
tap.ok(trueExp.exec({}), "check true")
tap.ok(jsonex.compile({ or: [true, false, false] }).exec(), "check true, a true")
tap.ok(jsonex.compile({ or: [false, true, false] }).exec(), "check true, a true")
tap.ok(jsonex.compile({ or: [false, false, true] }).exec(), "check true, a true")
const falseExp = jsonex.compile({ or: [false, false] });
tap.notOk(falseExp.exec(), "check false")
tap.notOk(jsonex.compile({ or: [false, null] }).exec(), "check false")
tap.notOk(jsonex.compile({ or: [false, 1] }).exec(), "check false, on diff type")
tap.notOk(jsonex.compile({ or: [false, "false"] }).exec(), "check false, on diff type")
tap.notOk(jsonex.compile({ or: [false, 0] }).exec(), "check false, on diff type")

const alwaysTrueExceptNullExp = jsonex.compile({ or: [{ name: "isTrue" }, true] });
tap.notOk(alwaysTrueExceptNullExp.exec({}), "check always true except null")
tap.ok(alwaysTrueExceptNullExp.exec({ isTrue: true }), "check always true except null, pass true")
tap.ok(alwaysTrueExceptNullExp.exec({ isTrue: true }), "check always true except null, pass false")
tap.notOk(alwaysTrueExceptNullExp.exec({ isTrue: null }), "check always true except null encouter first, pass null")
const alwaysTrueExp = jsonex.compile({ or: [true, { name: "isTrue" }, false] });
tap.ok(alwaysTrueExp.exec({ isTrue: true }), "check always, pass true")
tap.ok(alwaysTrueExp.exec({ isTrue: false }), "check always, pass false")
tap.ok(alwaysTrueExp.exec({ isTrue: null }), "check always, pass false")
tap.throws(() => alwaysTrueExp.exec(null), 'null is not support on non value JSON expression', "must pass json as data")

const ageGreater18AndGreaterOrEqualAllowAgeExp = jsonex.compile({ and: [{ "greater": [{ "name": "age" }, 18] }, { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] }] });
tap.ok(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 19, allowAge: 19 }), "age 19; 19>18 and 19>=19")
tap.ok(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 19, allowAge: 10 }), "age 19; 19>18 and 19>=10")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 10 }), "age not 18")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ notage: 10, allowAge: 10 }), "no age")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: null }), "age is null")
tap.throws(() => ageGreater18AndGreaterOrEqualAllowAgeExp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageGreater18OrAgeGreaterThanAllowAgeOrPermitByParentExp = jsonex.compile({
    or: [
        { "greater": [{ "name": "age" }, 18] },
        { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
        { "name": "isPermittedByParent" }

    ]
});
tap.ok(ageGreater18OrAgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 19, allowAge: 28, isPermittedByParent: true }), "age 19; 19>18 or 19>=allowAge or isPermittedByParent")
tap.ok(ageGreater18OrAgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 17, allowAge: 10, isPermittedByParent: false }), "age 17; 17>18 or 17>=allowAge or isPermittedByParent")
tap.ok(ageGreater18OrAgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 17, allowAge: 20, isPermittedByParent: true }), "age 17; 17>18 or 17>=20 or isPermittedByParent")


//nested and
const ageGreater18Or_AgeGreaterThanAllowAgeOrPermitByParentExp = jsonex.compile({
    or: [
        { "greater": [{ "name": "age" }, 18] },
        {
            or: [
                { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
                { "name": "isPermittedByParent" }
            ]
        }
    ]
});
tap.ok(ageGreater18Or_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 19, allowAge: 28, isPermittedByParent: true }), "age 19; 19>18 or 19>=allowAge or isPermittedByParent")
tap.ok(ageGreater18Or_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 17, allowAge: 10, isPermittedByParent: false }), "age 17; 17>18 or 17>=allowAge or isPermittedByParent")
tap.ok(ageGreater18Or_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 17, allowAge: 20, isPermittedByParent: true }), "age 17; 17>18 or 17>=20 or isPermittedByParent")
