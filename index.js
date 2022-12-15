const express = require ('express');
const {google} = require ('googleapis');

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    const {request, name} = req.body;

    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
      });

    // Create client instance for auth (Создаем экземпляр клиента для аутентификации)
    const client = await auth.getClient();

    //Instance of Google Sheets API (Экземпляр API Google Таблиц)
    const googleSheets = google.sheets({version: 'v4', auth: client})

    const spreadsheetId = '1mueCcubQErT_1jjyZg87_brf4eSnxOYeR1Scjh4N7FM'

    // Get metadata about spreadsheet (Получить метаданные о электронной таблице)
    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId,
    })

    // Read rows from spreadsheet (Чтение строк из электронной таблицы)
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: 'Sheet1!A:A',
    })

    // Write row(s) to spreadsheet (Записать строку(и) в электронную таблицу)
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: 'Sheet1!A:B',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [
                [request, name]
            ]
        },
    });

    res.send('Successfolly submitted!');
});

app.listen(1337, (req, res) => console.log('Running on 1331')); 