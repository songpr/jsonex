import tap from 'tap';
import jsonex from '../../index.js';
tap.notOk(jsonex.compile({ not: true }).exec(), "check false")
tap.ok(jsonex.compile({ not: false }).exec(), "check true")

tap.throws(() => { jsonex.compile({ not: [true] }) }, 'Array value is not support by "not" operator', "not do not support []")
tap.throws(() => jsonex.compile({ not: 1 }), '"not" operator support only boolean type value', "value must be boolean, true or false")
tap.throws(() => jsonex.compile({ not: null }), '"not" operator support only boolean type value', "value must be boolean, true or false")

const trueExp = jsonex.compile({ not: { and: [true, false] } });
tap.ok(trueExp.exec(), "check true")
tap.ok(trueExp.exec({}), "check true")
const falseExp = jsonex.compile({ not: { or: [false, true] } });
tap.notOk(falseExp.exec(), "check false")


const alwaysfalseExp = jsonex.compile({ not: { or: [true, { name: "isTrue" }] } });
tap.notOk(alwaysfalseExp.exec({}), "check always false null")
tap.notOk(alwaysfalseExp.exec({ isTrue: true }), "check always false, pass true")
tap.notOk(alwaysfalseExp.exec({ isTrue: null }), "check always false, pass true")
tap.throws(() => alwaysfalseExp.exec(null), 'null is not support on non value JSON expression', "must pass json as data")

const ageNotGreater18AndGreaterOrEqualAllowAgeExp = jsonex.compile({ and: [{ not: { "greater": [{ "name": "age" }, 18] } }, { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] }] });
tap.ok(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 18, allowAge: 18 }), "age 18; !(18>18) and 18>=18")
tap.ok(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 15, allowAge: 10 }), "age 15; !(15>18) and 15>=10")
tap.notOk(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 10 }), "age not 18")
tap.notOk(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ notage: 10, allowAge: 10 }), "no age")
tap.notOk(ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: null }), "age is null")
tap.throws(() => ageNotGreater18AndGreaterOrEqualAllowAgeExp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageNotGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp = jsonex.compile({
    and: [
        { not: { "greater": [{ "name": "age" }, 18] } },
        { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
        { "name": "isPermittedByParent" }

    ]
});
tap.ok(ageNotGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 17, allowAge: 10, isPermittedByParent: true }), "age 17; !(17>18) and (19>=allowAge or isPermittedByParent)")
tap.notOk(ageNotGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 17, isPermittedByParent: true }), "age 19; !(19>18) and (19>=allowAge or isPermittedByParent)")


//nested and
const ageGreater18And_NotAgeGreaterThanAllowAgeAndPermitByParentExp = jsonex.compile({
    and: [
        { "greater": [{ "name": "age" }, 18] },
        {
            not: {
                and: [
                    { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
                    { "name": "isPermittedByParent" }
                ]
            }
        }
    ]
});
tap.ok(ageGreater18And_NotAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 25, isPermittedByParent: false }), "age 19; 19>18 and !(19>=allowAge and false)")
tap.notOk(ageGreater18And_NotAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 10, isPermittedByParent: true }), "age 19; 19>18 and !(19>=allowAge and true)")
