import tap from 'tap'
import { DateTime } from "luxon"

const date = DateTime.fromISO("2022-11-01T00:00:00")
tap.ok(date.isValid,"is valid date")