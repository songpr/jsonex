JSON is great in representing static data however there are many cases
that we need standard way to represent dynamic data in JSON itself

Reserved names
==============

name in JSON that use for operators

  name             Operators or special variable
  ---------------- -------------------------------
  and              
  or               
  equal            
  greater          
  less             
  lessOrEqual      
  greaterOrEqual   
  not              
  in               
  notin            

comparison operators
====================

+-------------+-------------+-------------+-------------+-------------+
| operator    | JSON        | JSON data   | Result in   | note        |
|             | expression  | to evaluate | native true |             |
|             |             |             | or false    |             |
+=============+=============+=============+=============+=============+
| equal       | {"data":100 | {"data":100 | True        | data == 100 |
|             | }           | }           |             |             |
|             |             |             | false       | it's        |
|             | {equal:\[   | Today:"2022 |             | Thursday    |
|             |             | -10-06"     | true        |             |
|             | {type:"date |             |             | "Thursday"  |
|             | .weekday",  | {"birthday" | true        | =="Thursday |
|             | "name":"\$t | :"2022-10-1 |             | "           |
|             | oday"},     | 3"}         |             | =="Thursday |
|             |             |             |             | "           |
|             | "Monday"\]  | Today:"2022 |             |             |
|             |             | -10-06"     |             | 1==1==1     |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {equal:\[   |             |             |             |
|             |             |             |             |             |
|             | {type:"date |             |             |             |
|             | .weekday",  |             |             |             |
|             | "name":"\$t |             |             |             |
|             | oday"},     |             |             |             |
|             |             |             |             |             |
|             | {type:"date |             |             |             |
|             | .weekday",  |             |             |             |
|             | "name":"bir |             |             |             |
|             | thday"},    |             |             |             |
|             |             |             |             |             |
|             | "Thursday"\ |             |             |             |
|             | ]           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {equal:\[1, |             |             |             |
|             | 1,1\]}      |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| equal null  | {"data":nul | {"data":nul | true        | data ==     |
|             | l}          | l}          |             | null        |
|             |             |             | true        |             |
|             |             | {"abc":123} |             | data ==     |
|             |             |             |             | null since  |
|             |             |             |             | undefined   |
|             |             |             |             | (no "data"  |
|             |             |             |             | field)      |
|             |             |             |             |             |
|             |             |             |             | == null     |
+-------------+-------------+-------------+-------------+-------------+
| greater     | {age:       | {age:25}    | true        | age \> 25   |
| than        | {greater:18 |             |             |             |
|             | }}          |             | false       | 18 \> 25    |
|             |             |             |             |             |
|             | {greater:\[ |             | true        | 25\>10\>1   |
|             | 18,25\]}    |             |             |             |
|             |             |             |             |             |
|             | {greater:\[ |             |             |             |
|             | 25,10,1\]}  |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| less than   | {age:       | {age:50}    | false       | Age \< 50   |
|             | {less:40}   |             |             |             |
|             |             |             | false       | 25\<10\<11  |
|             | {less:\[25, |             |             |             |
|             | 10,11\]}    |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| greater     | {name:      | {"name":"ap | false       | name \>=    |
| than or     | {greaterOrE | ollo"}      |             | "apollo"    |
| equal       | qual:"Apoll |             | true        |             |
|             | o"          |             |             | 25\>=10\>=1 |
|             | }}          |             |             | 0           |
|             |             |             |             |             |
|             | {           |             |             |             |
|             | greaterOrEq |             |             |             |
|             | ual:\[25,10 |             |             |             |
|             | ,10\]}      |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| less than   | {birthday:  | {"birthday" | true        | birthday    |
| or equal    | {lessOrEqua | :"1999-12-3 |             | \>=         |
|             | l:"2000-01- | 1"}         | false       | "2000-01-01 |
|             | 01"         |             |             | "           |
|             | }}          |             |             |             |
|             |             |             |             | 25\<=50\<=1 |
|             | {           |             |             | 0           |
|             | lessOrEqual |             |             |             |
|             | :\[25,50,10 |             |             |             |
|             | \]}         |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| between     | {BTSfare:\[ | {"BTSfare": | true        | BTSfare     |
|             | 15,59\]     | 59}         |             | \>=15 &&    |
| Must always |             |             |             | BTSfare     |
| have 2      |             |             |             | \<=59       |
| values in   |             |             |             |             |
| array       |             |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| in -- equal | {gender:\[" | {"gender":" | true        | "male" in   |
| to a member | male","fema | male"}      |             | \["male",   |
|             | le"\]}      |             | true        | "female"\]  |
|             |             | {"gender":" |             |             |
|             | {in{"name": | male"}      | true        | "male"      |
|             | "gender","l |             |             | ="male"     |
|             | ist":\[     |             |             |             |
|             | "male","fem |             |             |             |
|             | ale"\]}     |             |             |             |
|             |             |             |             |             |
|             | {in{"value" |             |             |             |
|             | :"male","li |             |             |             |
|             | st":\[      |             |             |             |
|             | "male","fem |             |             |             |
|             | ale"\]}     |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| not         | {data:{not: | {"data":100 | false       | data != 100 |
|             | 100}}       | }           |             |             |
+-------------+-------------+-------------+-------------+-------------+
| not null    | {data:{not: | {"data":100 | true        | data !=     |
|             | null}}      | }           |             | null        |
+-------------+-------------+-------------+-------------+-------------+
| not in      | {age:{not:\ | {"age":16 } | true        | age not in  |
|             | [15,25,35,4 |             |             | \[15,25,35, |
|             | 5\]}}       | {"age":16 } | true        | 45\]        |
|             |             |             |             |             |
|             | {notin{"nam |             | false       | age != 15,  |
|             | e":"age","l |             |             | age != 25,  |
|             | ist":       |             |             | age != 35,  |
|             | \[15,25,35, |             |             | age != 45   |
|             | 45\]}       |             |             |             |
|             |             |             |             |             |
|             | {notin{"val |             |             |             |
|             | ue":25,"lis |             |             |             |
|             | t":         |             |             |             |
|             | \[15,25,35, |             |             |             |
|             | 45\]}       |             |             |             |
+-------------+-------------+-------------+-------------+-------------+

Logical operators

  operator   JSON expression                         JSON data to evaluate   Result in native true or false   note
  ---------- --------------------------------------- ----------------------- -------------------------------- ---------------------------------------
  and        {and:\[true,true,true,{data:100}\]}     {"data":100}            True                             true && true && true && true
  or         {or:\[false,false,false,{data:100}\]}   {"data":100}            true                             false \|\| false \|\| false \|\| true

Boolean
=======

Boolean native value still represents as true, false

+-------------+-------------+-------------+-------------+-------------+
| operator    | JSON        | JSON data   | Result in   | note        |
|             | expression  | to evaluate | native true |             |
|             |             |             | or false    |             |
+=============+=============+=============+=============+=============+
| return      | {"type":"bo | {"is\_thai" | true        |             |
| boolean     | olean"      | :           |             |             |
|             |             | true}       | false       |             |
|             | "name":     |             |             |             |
|             | "is\_Thai"  | {"is\_thai" | true        |             |
|             | }           | :           |             |             |
|             |             | false}      | false       |             |
|             |             |             |             |             |
|             |             | {"is\_thai" |             |             |
|             |             | :           |             |             |
|             |             | 1}          |             |             |
|             |             |             |             |             |
|             |             | {"is\_thai" |             |             |
|             |             | :           |             |             |
|             |             | 0}          |             |             |
+-------------+-------------+-------------+-------------+-------------+
| return      | {"type":"bo |             | true        | 0 == true   |
| boolean     | olean"      |             |             |             |
|             |             |             | false       | 1 == true   |
| value       | "value":    |             |             |             |
|             | true }      |             | false       | 11.1 ==     |
|             |             |             |             | true        |
|             | {"type":"bo |             | true        |             |
|             | olean"      |             |             | null ==     |
|             |             |             | false       | true        |
|             | "value":    |             |             |             |
|             | false }     |             | false       |             |
|             |             |             |             |             |
|             | {"type":"bo |             |             |             |
|             | olean"      |             |             |             |
|             |             |             |             |             |
|             | "value": 0  |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {"type":"bo |             |             |             |
|             | olean"      |             |             |             |
|             |             |             |             |             |
|             | "value": 1  |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {"type":"bo |             |             |             |
|             | olean"      |             |             |             |
|             |             |             |             |             |
|             | "value":    |             |             |             |
|             | 11.1 }      |             |             |             |
|             |             |             |             |             |
|             | {"type":"bo |             |             |             |
|             | olean"      |             |             |             |
|             |             |             |             |             |
|             | "value":    |             |             |             |
|             | null }      |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| not         | {"type":"bo | {"birthday" | true        | Birthday is |
|             | olean"      | :"2022-10-0 |             | not Monday. |
|             |             | 6"          |             |             |
|             | "value":    | }           |             | It's        |
|             | {not:{equal |             |             | "Thursday". |
|             | :\[         |             |             |             |
|             |             |             |             |             |
|             | {type:"date |             |             |             |
|             | .weekday"}, |             |             |             |
|             | "name":"bir |             |             |             |
|             | thday"},    |             |             |             |
|             |             |             |             |             |
|             | "Monday"    |             |             |             |
|             |             |             |             |             |
|             | \]}} }      |             |             |             |
+-------------+-------------+-------------+-------------+-------------+

Date
====

Date type in JSON expression

+-------------+-------------+-------------+-------------+-------------+
| case        | JSON        | JSON data   | Result      | note        |
|             | expression  | to evaluate | always in   |             |
|             |             |             | date        |             |
|             |             |             | instance    |             |
+=============+=============+=============+=============+=============+
| return date | {type:"date | {"birthday" | "2002-01-01 | date will   |
|             | "           | :"2002-01-0 | 00:00:00.00 | treat as    |
|             |             | 1"          | 0"          | local time  |
|             | "name":"bir | }           |             | e.g.        |
|             | thday"}     |             | "2022-10-06 | "2002-01-01 |
|             |             | {"birthday" | T05:24:28.5 | "           |
|             | {type:"date | :           | 36Z"        | will not    |
|             | ",          | 16650338685 |             | treat as    |
|             |             | 36}         | "1970-01-01 | 00:00 in    |
|             | "name":"\$t |             | T00:00:00.0 | UTC time as |
|             | oday"}      | {"birthday" | 00Z"        | Date in     |
|             |             | :           |             | Javascript  |
|             | {type:"date | 0}          | "1970-01-01 |             |
|             | ",          |             | T00:00:00.0 |             |
|             |             | {"aday":100 | 00Z"        |             |
|             | "name":"\$n | 0}          |             |             |
|             | ow"}        |             | "Invalid    |             |
|             |             | {"birthday" | Date"       |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     | "2022-10-06 |             |
|             |             |             | "           |             |
|             |             | today:"2022 |             |             |
|             |             | -10-06"     | Return      |             |
|             |             |             | special     |             |
|             |             | now:"2022-1 | field       |             |
|             |             | 0-06        | today's     |             |
|             |             | 13:01:01.59 | value       |             |
|             |             | 9"          |             |             |
|             |             |             | "2022-10-06 |             |
|             |             |             | 13:01:01.59 |             |
|             |             |             | 9"          |             |
|             |             |             |             |             |
|             |             |             | Return      |             |
|             |             |             | special     |             |
|             |             |             | field now's |             |
|             |             |             | value       |             |
+-------------+-------------+-------------+-------------+-------------+
| return date | {type:"date |             | "2002-01-01 | data ==     |
| value       | ",          |             | 00:00:00.00 | null        |
|             |             |             | 0"          |             |
|             | value:"2022 |             |             | data ==     |
|             | -01-01"}    |             | {"birthday" | null since  |
|             |             |             | :           | undefined   |
|             | {type:"date |             | 16650338685 | (no "data"  |
|             | ",          |             | 36}         | field)      |
|             |             |             |             |             |
|             | value:      |             | Throw       | == null     |
|             | 16650338685 |             | error, does |             |
|             | 36}         |             | not allow   |             |
|             |             |             | value that  |             |
|             | {type:"date |             | cannot      |             |
|             | ",          |             | convert to  |             |
|             |             |             | date        |             |
|             | value: "Not |             |             |             |
|             | a date"}    |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Modify date | {           | {"birthday" | "2003-01-16 | Support     |
|             |             | :"2002-01-0 | 01:00:00.00 |             |
|             | type:"date" | 1"          | 0"          | "day",      |
|             | ,           | }           |             | "month",    |
|             |             |             | "2001-01-01 | "year",     |
|             | "name":"bir | {"birthday" | 04:00"      | "hour",     |
|             | thday",     | :"2002-01-1 |             | "minute",   |
|             |             | 6           |             | "second"    |
|             | "add":{     | 05:00" }    |             |             |
|             |             |             |             |             |
|             | "day":15,   |             |             |             |
|             |             |             |             |             |
|             | "year":1,   |             |             |             |
|             |             |             |             |             |
|             | "hour":1    |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {           |             |             |             |
|             |             |             |             |             |
|             | type:"date" |             |             |             |
|             | ,           |             |             |             |
|             |             |             |             |             |
|             | "name":"bir |             |             |             |
|             | thday",     |             |             |             |
|             |             |             |             |             |
|             | "subtract": |             |             |             |
|             | {           |             |             |             |
|             |             |             |             |             |
|             | "day":15,   |             |             |             |
|             |             |             |             |             |
|             | "year":1,   |             |             |             |
|             |             |             |             |             |
|             | "hour":1    |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Before      | {expire\_da | {"expire\_d | true        | Before      |
|             | te:         | ate":"2222- |             | expire date |
| Before 15   |             | 12-01"      | False       |             |
| days        | {           | }           |             | Today \<    |
|             |             |             | false       | expire\_dat |
|             | greater:{ty | today:"2022 |             | e           |
|             | pe:"date",  | -10-06"     |             | -- 15       |
|             |             |             |             |             |
|             | name:"\$tod | {"expire\_d |             | ==          |
|             | ay"}        | ate":"2022- |             | expire\_dat |
|             |             | 10-15" }    |             | e           |
|             | }           |             |             | \> today +  |
|             |             | today:"2022 |             | 15          |
|             | }           | -10-06"     |             |             |
|             |             |             |             | Today \<    |
|             | {expire\_da | today + 15: |             | expire\_dat |
|             | te:         | "2022-10-21 |             | e           |
|             |             |             |             | -- 15       |
|             | {           | {"expire\_d |             |             |
|             |             | ate":"2022- |             |             |
|             | greater:    | 10-15" }    |             |             |
|             |             |             |             |             |
|             | {type:"date | today:"2022 |             |             |
|             | ",          | -10-06"     |             |             |
|             |             |             |             |             |
|             | name:"\$tod | expire\_dat |             |             |
|             | ay",        | e           |             |             |
|             |             | - 15:       |             |             |
|             | "add":{     | "2022-09-30 |             |             |
|             |             |             |             |             |
|             | "day":15    |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | {\$today:   |             |             |             |
|             |             |             |             |             |
|             | {           |             |             |             |
|             |             |             |             |             |
|             | less:       |             |             |             |
|             |             |             |             |             |
|             | {type:"date |             |             |             |
|             | ",          |             |             |             |
|             | name:"expir |             |             |             |
|             | e\_date",   |             |             |             |
|             |             |             |             |             |
|             | "subtract": |             |             |             |
|             | {           |             |             |             |
|             |             |             |             |             |
|             | "day":15    |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| within 15   | {expire\_da | {"expire\_d | True        | expired     |
| days before | te:         | ate":"2022- |             | before      |
| expired     |             | 10-15" }    | False       | today       |
|             | {           |             |             |             |
|             |             | {"expire\_d | true        | start of    |
|             | Between: \[ | ate":"2022- |             | the period  |
|             |             | 10-01" }    |             |             |
|             | {type:"date |             |             |             |
|             | ",          | {"expire\_d |             |             |
|             |             | ate":"2022- |             |             |
|             | value:"toda | 10-21" }    |             |             |
|             | y"          |             |             |             |
|             |             | today:"2022 |             |             |
|             | },          | -10-06"     |             |             |
|             |             |             |             |             |
|             | {type:"date | between:    |             |             |
|             | ",          | \["2022-10- |             |             |
|             |             | 06",        |             |             |
|             | value:"toda | "2022-10-21 |             |             |
|             | y",         | "\]         |             |             |
|             |             |             |             |             |
|             | "add":{     |             |             |             |
|             |             |             |             |             |
|             | "day":15    |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | \]          |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
|             |             |             |             |             |
|             | }           |             |             |             |
+-------------+-------------+-------------+-------------+-------------+

Part of date
------------

+-------------+-------------+-------------+-------------+-------------+
| case        | JSON        | JSON data   | Result in   | note        |
|             | expression  | to evaluate | number      |             |
|             |             |             | except      |             |
|             |             |             | weekday     |             |
|             |             |             | (string)    |             |
+=============+=============+=============+=============+=============+
| day in week | {type:"date | {"birthday" | 2           | date will   |
|             | .day"       | :"2002-01-0 |             | treat as    |
| 1-7         |             | 1"          | NaN         | local time  |
|             | "name":"bir | }           |             | e.g.        |
| Sunday=1    | thday"}     |             |             | "2002-01-01 |
|             |             | {"birthday" |             | "           |
| Monday=2    |             | :"Not       |             | will not    |
|             |             | a day"}     |             | treat as    |
| ...         |             |             |             | 00:00 in    |
|             |             |             |             | UTC time as |
| Saturday=7  |             |             |             | Date in     |
|             |             |             |             | Javascript  |
+-------------+-------------+-------------+-------------+-------------+
| Weekday     | {type:"date | {"birthday" | "Thursday"  |             |
|             | .weekday"   | :"2022-10-0 |             |             |
| "Sunday",   |             | 6"          | null        |             |
| "Monday",   | "name":"bir | }           |             |             |
|             | thday"}     |             |             |             |
| "Tuesday",  |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
| ...         |             | a day"}     |             |             |
|             |             |             |             |             |
| "Saturday"  |             |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Date of     | {type:"date | {"birthday" | 6           |             |
| month       | .date"      | :"2022-10-0 |             |             |
|             |             | 6"          | NaN         |             |
|             | "name":"bir | }           |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Month of    | {type:"date | {"birthday" | 10          |             |
| year        | .month"     | :"2022-10-0 |             |             |
|             |             | 6"          | NaN         |             |
|             | "name":"bir | }           |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Date of     | {type:"date | {"birthday" | 2022        |             |
| month       | .year"      | :"2022-10-0 |             |             |
|             |             | 6"          | NaN         |             |
|             | "name":"bir | }           |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Hour of day | {type:"date | {"birthday" | 21          |             |
|             | .hour"      | :"2022-10-0 |             |             |
|             |             | 6           | NaN         |             |
|             | "name":"bir | 21:00" }    |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Minute of   | {type:"date | {"birthday" | 00          |             |
| hour        | .minute"    | :"2022-10-0 |             |             |
|             |             | 6           | NaN         |             |
|             | "name":"bir | 21:00" }    |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Second of   | {type:"date | {"birthday" | 12          |             |
| minute      | .secord"    | :"2022-10-0 |             |             |
|             |             | 6           | NaN         |             |
|             | "name":"bir | 21:00:12" } |             |             |
|             | thday"}     |             |             |             |
|             |             | {"birthday" |             |             |
|             |             | :"Not       |             |             |
|             |             | a day"}     |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Birthday is | {target\_da | {target\_da | false       |             |
| 25^th^      | te:{type:"d | te:25,      |             |             |
|             | ate.date"   |             |             |             |
|             |             | "birthday": |             |             |
|             | "name":"bir | "2022-10-06 |             |             |
|             | thday"}}    | 21:00:12"}  |             |             |
+-------------+-------------+-------------+-------------+-------------+
| Every       | {type:"date |             |             |             |
| birthday    | .date"      |             |             |             |
|             |             |             |             |             |
|             | "name":"bir |             |             |             |
|             | thday"}:    |             |             |             |
+-------------+-------------+-------------+-------------+-------------+
