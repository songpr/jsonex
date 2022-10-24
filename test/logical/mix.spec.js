import tap from 'tap';
import { jsonex } from '../../index.js';
tap.throws(() => { jsonex.compile({ and: [true] }) }, 'value for "and" operator must be array with length at least 2', "value must be array length >= 2")
tap.throws(() => jsonex.compile({ and: true }), 'value for "equal" operator must be array with length at least 2', "value must be array length >= 2")

const ageGreater18And_AgeGreaterThanAllowAgeOrPermitByParentExp = jsonex.compile({
    and: [
        { "greater": [{ "name": "age" }, 18] },
        {
            or: [
                { "greaterOrEqual": [{ "name": "age" }, { "name": "allowAge" }] },
                { "name": "isPermittedByParent" }
            ]
        }
    ]
});
tap.ok(ageGreater18And_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 19, allowAge: 25, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge or isPermittedByParent)")
tap.ok(ageGreater18And_AgeGreaterThanAllowAgeOrPermitByParentExp.exec({ age: 19, allowAge: 10, isPermittedByParent: true }), "age 19; 19>18 and (19>=allowAge or isPermittedByParent)")
