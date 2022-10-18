JSON is great in representing static data however there are many cases
that we need standard way to represent dynamic data in JSON itself

# Reserved names

name in JSON that use for operators

| **name**       | **Operators or special variable** |
| -------------- | --------------------------------- |
| and            |                                   |
| or             |                                   |
| equal          |                                   |
| greater        |                                   |
| less           |                                   |
| lessOrEqual    |                                   |
| greaterOrEqual |                                   |
| not            |                                   |
| in             |                                   |
| notin          |                                   |
| name           |                                   |
| value          |                                   |

# Simple expression

<table>
<thead>
<tr class="header">
<th>operator</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result in native value e.g., true or false, 1,2, [1,2]</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Reference a field value</td>
<td>{“name”:”data”}</td>
<td>{“data”:100}</td>
<td>100</td>
<td></td>
</tr>
<tr class="even">
<td>A native value</td>
<td><p>100</p>
<p>1.2</p>
<p>“hello world”</p>
<p>true</p>
<p>false</p>
<p>[1,2,3,4]</p>
<p>[1,2,”text”,null]</p>
<p>null</p></td>
<td></td>
<td><p>100</p>
<p>1.2</p>
<p>“hello world”</p>
<p>true</p>
<p>false</p>
<p>[1,2,3,4]</p>
<p>[1,2,”text”,null]</p>
<p>null</p></td>
<td>string, number, boolean, null, array of values without type conversion no date value</td>
</tr>
<tr class="odd">
<td>equal</td>
<td>{“$data”:100}</td>
<td>{“data”:100}</td>
<td>true</td>
<td><p>data === 100</p>
<p>reference a property in JSON object using ${name}</p></td>
</tr>
<tr class="even">
<td>equal null</td>
<td>{“$data”:null}</td>
<td><p>{“data”:null}</p>
<p>{“abc”:123}</p></td>
<td><p>true</p>
<p>true</p></td>
<td><p>data === null</p>
<p>$data == null since undefined (no “data” field)</p>
<p>== null</p>
<p>Use to check both a property in JSON data is store null value or not this property name</p></td>
</tr>
<tr class="odd">
<td>in – equal to a member</td>
<td>{“$gender”:[“male”, ”female”]}</td>
<td>{“gender”:”male”}</td>
<td>true</td>
<td>“male” in [“male”, “female”]</td>
</tr>
<tr class="even">
<td>not</td>
<td>{“!$data”:100}}</td>
<td>{“data”:100}</td>
<td>false</td>
<td><p>data !== 100</p>
<p>reference a property in JSON object using !${name}</p>
<p>for native value (not array, object)</p></td>
</tr>
<tr class="odd">
<td>not null</td>
<td>{“!$data”:null }</td>
<td><p>{“data”:100}</p>
<p>{“data2”:100}</p></td>
<td><p>true</p>
<p>false</p></td>
<td><p>data != null</p>
<p>data != null =&gt; false, no data property</p>
<p>reference a property in JSON object using !${name} for null value</p></td>
</tr>
<tr class="even">
<td>not in</td>
<td>{“!$age”:[15,25,35,45]}</td>
<td>{“age”:16 }</td>
<td>true</td>
<td>age not in [15,25,35,45]</td>
</tr>
</tbody>
</table>

# Operators

## comparison operators

<table>
<thead>
<tr class="header">
<th>operator</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result in native true or false</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>equal</td>
<td><p>{“$data”:100}</p>
<p>{“equal”:[ {“type”:”date.weekday”, “name”:”$today”},</p>
<p>“Monday” ]</p>
<p>}</p>
<p>{“equal”:[ {“type”:”date.weekday”, “name”:”$today”},</p>
<p>{“type”:”date.weekday”, “name”:”birthday”},</p>
<p>“Thursday”]</p>
<p>}</p>
<p>{“equal”:[1,1,1]}</p></td>
<td><p>{“data”:100}</p>
<p>Today:”2022-10-06”</p>
<p>{“birthday”:”2022-10-13”}</p>
<p>Today:”2022-10-06”</p></td>
<td><p>True</p>
<p>false</p>
<p>true</p>
<p>true</p></td>
<td><p>data === 100</p>
<p>it’s Thursday</p>
<p>“Thursday” ==”Thursday” ==”Thursday”</p>
<p>The day of birthday and today are Thursday</p>
<p>1==1==1</p></td>
</tr>
<tr class="even">
<td>equal null</td>
<td>{“$data”:null}</td>
<td><p>{“data”:null}</p>
<p>{“abc”:123}</p></td>
<td><p>true</p>
<p>true</p></td>
<td><p>data === null</p>
<p>data === null since undefined (no “data” field)</p>
<p>=== null</p></td>
</tr>
<tr class="odd">
<td>greater than</td>
<td><p>{“$age”: {“greater”:18}}</p>
<p>{“greater”:[18,25]}</p>
<p>{“greater”:[25,10,1]}</p></td>
<td>{“age”:25}</td>
<td><p>true</p>
<p>false</p>
<p>true</p></td>
<td><p>age &gt; 25</p>
<p>18 &gt; 25</p>
<p>25&gt;10&gt;1</p></td>
</tr>
<tr class="even">
<td>less than</td>
<td><p>{“$age”: {“less”:40}</p>
<p>{“less”:[25,10,11]}</p></td>
<td>{“age”:50}</td>
<td><p>false</p>
<p>false</p></td>
<td><p>Age &lt; 50</p>
<p>25&lt;10&lt;11</p></td>
</tr>
<tr class="odd">
<td>greater than or equal</td>
<td><p>{“$name”: {“greaterOrEqual”:”Apollo” }}</p>
<p>{ “greaterOrEqual”:[25,10,10]}</p></td>
<td>{“name”:”apollo”}</td>
<td><p>false</p>
<p>true</p></td>
<td><p>name &gt;= “apollo”</p>
<p>25&gt;=10&gt;=10</p></td>
</tr>
<tr class="even">
<td>less than or equal</td>
<td><p>{“$birthday”: {lessOrEqual:”2000-01-01” }}</p>
<p>{ “lessOrEqual”:[25,50,10]}</p></td>
<td>{“birthday”:”1999-12-31”}</td>
<td><p>true</p>
<p>false</p></td>
<td><p>birthday &gt;= “2000-01-01”</p>
<p>25&lt;=50&lt;=10</p></td>
</tr>
<tr class="odd">
<td><p>between</p>
<p>Must always have 2 values in array</p></td>
<td>{“$BTSfare”:{“between”:[15,59]}}</td>
<td>{“BTSfare”:59}</td>
<td>true</td>
<td>BTSfare &gt;=15 &amp;&amp; BTSfare &lt;=59</td>
</tr>
<tr class="even">
<td>in – equal to a member</td>
<td><p>{“$gender”:[“male”,”female”]}</p>
<p>{“in”:{“name”:”gender”,”values”:[ “male”,”female”]}</p>
<p>{“in”:{“value”:”male”,”values”:[ “male”,”female”]}</p></td>
<td><p>{“gender”:”male”}</p>
<p>{“gender”:”male”}</p></td>
<td><p>true</p>
<p>true</p>
<p>true</p></td>
<td><p>“male” in [“male”, “female”]</p>
<p>“male” =”male”</p></td>
</tr>
<tr class="odd">
<td>not null</td>
<td>{“!$data”:null }</td>
<td><p>{“data”:100}</p>
<p>{“data2”:100}</p></td>
<td><p>true</p>
<p>false</p></td>
<td><p>data != null</p>
<p>data != null =&gt; false, no data property</p></td>
</tr>
<tr class="even">
<td>not in</td>
<td><p>{“!$age”:[15,25,35,45]}</p>
<p>{“notin”:{“name”:”age”,”values”: [15,25,35,45]}</p>
<p>{“notin”:{“value”:25,”values”: [15,25,35,45]}</p></td>
<td><p>{“age”:16 }</p>
<p>{“age”:16 }</p></td>
<td><p>true</p>
<p>true</p>
<p>false</p></td>
<td><p>age not in [15,25,35,45]</p>
<p>age != 15, age != 25, age != 35, age != 45</p>
<p>25 not in [15,25,35,45]</p></td>
</tr>
</tbody>
</table>

## Logical operators

<table>
<thead>
<tr class="header">
<th>operator</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result in native true or false</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>and</td>
<td>{and:[true,true,true,{“$data”:100}]}</td>
<td>{“data”:100}</td>
<td>True</td>
<td>true &amp;&amp; true &amp;&amp; true &amp;&amp; true</td>
</tr>
<tr class="even">
<td>or</td>
<td>{or:[false,false,false,{“$data”:100}]}</td>
<td>{“data”:100}</td>
<td>true</td>
<td>false || false || false || true</td>
</tr>
<tr class="odd">
<td>not</td>
<td><p>{“!$data”:100}}</p>
<p>{“not”:{“name”:”is_good”}}</p>
<p>{“not”:{“$data”:100}}</p>
<p>{“not”:[true,false,1,2,0,null]}</p>
<p>{“not”:{“name”:”data” } }</p></td>
<td><p>{“data”:100}</p>
<p>{ “is_good”:false }</p>
<p>{“data”:100}</p>
<p>{“data”: [true,false,1,2,0,null]}</p></td>
<td><p>false</p>
<p>true</p>
<p>false</p>
<p>[false, true, false, false, true, true]</p>
<p>[false, true, false, false, true, true]</p></td>
<td><p>data !== 100</p>
<p>!false</p>
<p>!(data === 100)</p>
<p>[!true, !false, !1, !2, !0, !null]</p>
<p>[!true, !false, !1, !2, !0, !null]</p></td>
</tr>
</tbody>
</table>

# 

# TYPE Conversion

## Boolean

Boolean native value still represents as true, false

<table>
<thead>
<tr class="header">
<th>operator</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result in native true or false</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>return boolean</td>
<td><p>{“type”:”boolean”</p>
<p>“name”: “is_thai” }</p></td>
<td><p>{“is_thai”: true}</p>
<p>{“is_thai”: false}</p>
<p>{“is_thai”: 1}</p>
<p>{“is_thai”: 0}</p>
<p>{“is_thai”: “text”}</p></td>
<td><p>true</p>
<p>false</p>
<p>true</p>
<p>false</p>
<p>false</p></td>
<td><p>1 == true</p>
<p>0 == true</p>
<p>“text”== true</p></td>
</tr>
<tr class="even">
<td><p>return boolean</p>
<p>value</p></td>
<td><p>{“type”:”boolean”, “value”: true }</p>
<p>{“type”:”boolean”, “value”: false }</p>
<p>{“type”:”boolean”, “value”: 0 }</p>
<p>{“type”:”boolean”, “value”: 1 }</p>
<p>{“type”:”boolean”, “value”: 11.1 }</p>
<p>{“type”:”boolean”, “value”: null }</p></td>
<td></td>
<td><p>true</p>
<p>false</p>
<p>false</p>
<p>true</p>
<p>false</p>
<p>false</p></td>
<td><p>0 == true</p>
<p>1 == true</p>
<p>11.1 == true</p>
<p>null == true</p></td>
</tr>
<tr class="odd">
<td>not the day in week</td>
<td><p>{“not”:{“equal”:[</p>
<p>{“type”:”date.weekday”}, ”name”:”birthday”},</p>
<p>“Monday”</p>
<p>]}}</p></td>
<td>{“birthday”:”2022-10-06” }</td>
<td>true</td>
<td><p>Birthday is not Monday.</p>
<p>It’s “Thursday”.</p></td>
</tr>
</tbody>
</table>

## Date

Date type in JSON expression

<table>
<thead>
<tr class="header">
<th>case</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result always in date instance</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>return date</td>
<td><p>{“type”:”date”,</p>
<p>“name”:”birthday”}</p>
<p>{“type”:”date”,</p>
<p>“value”:”$today”}</p>
<p>{“type”:”date”,</p>
<p>“value”:”$now”}</p></td>
<td><p>{“birthday”:”2002-01-01” }</p>
<p>{“birthday”: 1665033868536}</p>
<p>{“birthday”: 0}</p>
<p>{“aday”:1000}</p>
<p>{“birthday”:”Not a day”}</p>
<p>today:”2022-10-06”</p>
<p>now:”2022-10-06 13:01:01.599”</p></td>
<td><p>“2002-01-01 00:00:00.000”</p>
<p>“2022-10-06T05:24:28.536Z”</p>
<p>“1970-01-01T00:00:00.000Z”</p>
<p>“1970-01-01T00:00:00.000Z”</p>
<p>“Invalid Date”</p>
<p>”2022-10-06”</p>
<p>Return special field today’s value</p>
<p>”2022-10-06 13:01:01.599”</p>
<p>Return special field now’s value</p></td>
<td><p>date will treat as local time e.g. “2002-01-01” will not treat as 00:00 in UTC time as Date in Javascript</p>
<p>“$today”can be used to reference today date without time,</p>
<p>“$now” can be used to reference current datetime.</p>
<p>Both cannot use outside of “type”:”date” e.g., {“$today”:100}</p>
<p>Mean reference value of JSON property name “today”</p></td>
</tr>
<tr class="even">
<td>return date value</td>
<td><p>{“type”:”date”,</p>
<p>“value”:”2022-01-01”}</p>
<p>{“type”:”date”,</p>
<p>“value”: 1665033868536}</p>
<p>{“type”:”date”,</p>
<p>“value”: “Not a date”}</p></td>
<td></td>
<td><p>“2002-01-01 00:00:00.000”</p>
<p>{“birthday”: 1665033868536}</p></td>
<td><p>See <a href="https://www.w3schools.com/js/js_dates.asp">JavaScript Date Objects (w3schools.com)</a></p>
<p>Throw error, does not allow value that cannot convert to date</p></td>
</tr>
<tr class="odd">
<td>Modify date</td>
<td><p>{</p>
<p>“type”:”date”,</p>
<p>“name”:”birthday”,</p>
<p>“add”:{</p>
<p>“day”:15,</p>
<p>“year”:1,</p>
<p>“hour”:1</p>
<p>}</p>
<p>}</p>
<p>{</p>
<p>“type”:”date”,</p>
<p>“name”:”birthday”,</p>
<p>“subtract”:{</p>
<p>“day”:15,</p>
<p>“year”:1,</p>
<p>“hour”:1</p>
<p>}</p>
<p>}</p></td>
<td><p>{“birthday”:”2002-01-01” }</p>
<p>{“birthday”:”2002-01-16 05:00” }</p></td>
<td><p>“2003-01-16 01:00:00.000”</p>
<p>“2001-01-01 04:00”</p></td>
<td><p>Support</p>
<p>“day”, “month”, ”year”, “hour”, “minute”, “second”</p></td>
</tr>
<tr class="even">
<td>Before</td>
<td><p>{“$expire_date”: {“greater”:{“type”:”date”, “value”:”$today”}</p>
<p>}</p>
<p>}</p>
<p>{“$expire_date”:</p>
<p>{</p>
<p>“greater”:</p>
<p>{“type”:”date”,</p>
<p>“value”:”$today”,</p>
<p>“add”:{</p>
<p>“day”:15</p>
<p>}</p>
<p>}</p>
<p>}</p>
<p>}</p></td>
<td><p>{“expire_date”:”2222-12-01” }</p>
<p>today:”2022-10-06”</p>
<p>{“expire_date”:”2022- 10-15” }</p>
<p>today:”2022-10-06”</p>
<p>today + 15: “2022-10-21</p></td>
<td><p>true</p>
<p>False</p></td>
<td><p>Before expire date</p>
<p>Today &lt; expire_date – 15</p>
<p>== expire_date &gt; today + 15</p></td>
</tr>
<tr class="odd">
<td>within 15 days before expired</td>
<td><p>{“$expire_date”:</p>
<p>{</p>
<p>“between”: [</p>
<p>{“type<br />
:”date”, “value”:”$today”</p>
<p>},</p>
<p>{type:”date”,</p>
<p>“value”:”$today”,</p>
<p>“add”:{</p>
<p>“day”:15</p>
<p>}</p>
<p>]</p>
<p>}</p>
<p>}</p>
<p>}</p></td>
<td><p>{“expire_date”:”2022- 10-15” }</p>
<p>{“expire_date”:”2022- 10-01” }</p>
<p>{“expire_date”:”2022- 10-21” }</p>
<p>today:”2022-10-06”</p>
<p>between: [“2022-10-06”, “2022-10-21”]</p></td>
<td><p>true</p>
<p>false</p>
<p>true</p></td>
<td><p>expired before today</p>
<p>start of the period</p></td>
</tr>
</tbody>
</table>

## Part of date

<table>
<thead>
<tr class="header">
<th>case</th>
<th>JSON expression</th>
<th>JSON data to evaluate</th>
<th>Result in number except weekday (string)</th>
<th>note</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><p>day in week</p>
<p>1-7</p>
<p>Sunday=1</p>
<p>Monday=2</p>
<p>…</p>
<p>Saturday=7</p></td>
<td><p>{type:”date.day”,</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2002-01-01” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>2</p>
<p>NaN</p></td>
<td>date will treat as local time e.g. “2002-01-01” will not treat as 00:00 in UTC time as Date in Javascript</td>
</tr>
<tr class="even">
<td><p>Weekday</p>
<p>“Sunday”, “Monday”,</p>
<p>“Tuesday”,</p>
<p>…</p>
<p>“Saturday”</p></td>
<td><p>{“type”:”date.weekday”,</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>“Thursday”</p>
<p>null</p></td>
<td></td>
</tr>
<tr class="odd">
<td>Date of month</td>
<td><p>{“type”:”date.date”,</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>6</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="even">
<td>Month of year</td>
<td><p>{“type”:”date.month”,</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>10</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="odd">
<td>Date of month</td>
<td><p>{“type”:”date.year”</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>2022</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="even">
<td>Hour of day</td>
<td><p>{“type”:”date.hour”</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06 21:00” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>21</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="odd">
<td>Minute of hour</td>
<td><p>{“type”:”date.minute”</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06 21:00” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>00</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="even">
<td>Second of minute</td>
<td><p>{“type”:”date.secord”</p>
<p>“name”:”birthday”}</p></td>
<td><p>{“birthday”:”2022-10-06 21:00:12” }</p>
<p>{“birthday”:”Not a day”}</p></td>
<td><p>12</p>
<p>NaN</p></td>
<td></td>
</tr>
<tr class="odd">
<td>Birthday is 25<sup>th</sup></td>
<td><p>{“target_date”:{“type”:”date.date”</p>
<p>“name”:”birthday”}}</p></td>
<td><p>{target_date:25,</p>
<p>“birthday”:”2022-10-06 21:00:12”}</p></td>
<td>false</td>
<td></td>
</tr>
<tr class="even">
<td>Every birthday’s month</td>
<td>{“equal”:[{type:”date.month”, “name”:”birthday”}, {“type”:”date.month”, “value”:”$today”}]}</td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
