import tap from 'tap'
import { DateTime } from "luxon"

const date = DateTime.fromSQL("2022-11-01 00:00:00")
tap.ok(date.isValid,"is valid date")