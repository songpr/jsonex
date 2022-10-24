import tap from 'tap';
import { jsonex } from '../../index.js';
tap.throws(() => { jsonex.compile({ and: [true] }) }, 'value for "and" operator must be array with length at least 2', "value must be array length >= 2")
tap.throws(() => jsonex.compile({ and: true }), 'value for "equal" operator must be array with length at least 2', "value must be array length >= 2")

const trueExp = jsonex.compile({ and: [true, true] });
tap.ok(trueExp.exec(), "check true")
tap.ok(trueExp.exec({}), "check true")
const falseExp = jsonex.compile({ and: [false, true] });
tap.notOk(falseExp.exec(), "check false")

const alwaysfalseExp = jsonex.compile({ and: [false, { name: "isTrue" }] });
tap.notOk(alwaysfalseExp.exec({}), "check always false null")
tap.notOk(alwaysfalseExp.exec({ isTrue: true }), "check always false, pass true")
tap.notOk(alwaysfalseExp.exec({ isTrue: null }), "check always false, pass true")
tap.throws(() => alwaysfalseExp.exec(null), 'null is not support on non value JSON expression', "must pass json as data")

const ageGreater18AndGreaterOrEqualAllowAgeExp = jsonex.compile({ and: [{ "greater": [{ "name": "age" }, 18] }, { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] }] });
tap.ok(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 19, allowAge: 19 }), "age 19; 19>18 and 19>=19")
tap.ok(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 19, allowAge: 10 }), "age 19; 19>18 and 19>=10")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: "18" }), '"18" is not 18')
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: 10 }), "age not 18")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ notage: 10, allowAge: 10 }), "no age")
tap.notOk(ageGreater18AndGreaterOrEqualAllowAgeExp.exec({ age: null }), "age is null")
tap.throws(() => ageGreater18AndGreaterOrEqualAllowAgeExp.exec(null), "null is not support on non value JSON expression", "not support null if have name reference")

const ageGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp = jsonex.compile({
    and: [
        { "greater": [{ "name": "age" }, 18] },
        { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
        { "name": "isPermittedByParent" }

    ]
});
tap.ok(ageGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 10, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge or isPermittedByParent)")
tap.notOk(ageGreater18AndAgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 25, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge or isPermittedByParent)")


//nested and
const ageGreater18And_AgeGreaterThanAllowAgeAndPermitByParentExp = jsonex.compile({
    and: [
        { "greater": [{ "name": "age" }, 18] },
        {
            and: [
                { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
                { "name": "isPermittedByParent" }
            ]
        }
    ]
});
tap.ok(ageGreater18And_AgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 10, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge and isPermittedByParent)")
tap.notOk(ageGreater18And_AgeGreaterThanAllowAgeAndPermitByParentExp.exec({ age: 19, allowAge: 25, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge and isPermittedByParent)")
