import tap from 'tap'
const { default: jsonex } = await import('jsonexpression');

const TYM_MA = jsonex.compile({
    "and": [
        {
            "equal": [
                {
                    "name": "TYM_Main_Model"
                },
                "Model1"
            ]
        },
        {
            "less": [
                {
                    "name": "TYM-ma-next-date1",
                    "type": "date"
                },
                {
                    "type": "date",
                    "value": "$today"
                }
            ]
        }
    ]
});
tap.ok(TYM_MA.exec( {
    id: 3,
    TYM_Main_Model: 'Model1',
    'TYM-ma-next-date1': '2020-08-01 00:00:00',
    'TYM-engine-no2': '456-MONE',
    TYM_status_waiting_no_2: null,
    'TYM-ma-next-date2': '2021-01-11 23:59:00.000',
    'TYM-engine-no3': null,
    TYM_status_waiting_no_3: null
}), "Model1 Next MA date")

