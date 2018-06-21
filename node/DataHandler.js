//   todo:

`use strict`;

const FS = require(`fs`);
const SQL = require(`sqlite3`).verbose();

class DataHandler {
    constructor() {
        this.key = FS.readFileSync(`data/encryption/cert.key`);
        this.cert = FS.readFileSync(`data/encryption/cert.pem`);
        this.createDB();
        this.initDB();
        // this.insertRow();
        // this.queryData();
        // this.db.close();
    }

    createDB() {
        this.db = new SQL.Database(`data/asset_data.db`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Connected to Sqlite DB`);
        });
    }

    initDB() {
        this.db.run(`CREATE TABLE IF NOT EXISTS assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        maker TEXT,
        model TEXT,
        tag INTEGER,
        sn TEXT,
        type TEXT,
        description TEXT,
        isTitle1 INTEGER DEFAULT 0,
        isTitle9 INTEGER DEFAULT 0,
        is31a INTEGER DEFAULT 0
        )`); //https://stackoverflow.com/questions/40645216/check-if-sql-table-exists-in-python
        console.log(`Sqlite table created`);
    }

    insertRow() {
        this.db.run(`INSERT INTO assets (name) VALUES(?)`, ['WIGgLES-0'], function(err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });
    }

    queryData() {
        let sql = `SELECT DISTINCT Name name FROM assets ORDER BY name`;
        this.db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                console.log(row.name);
            });
        });
    }

    static renderDom(path, contentType, callback, encoding) {
        FS.readFile(path, encoding ? encoding : `utf-8`, (error, string) => {
            callback(error, string, contentType);
        });
    }

    static setBaseData(callback) {
        let filePath = `data/ZipCodeDB.csv`, columns = 3;
        FS.readFile(filePath, `utf8`, (err, file) => {
            let tempArray, finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            for (let i = 0; i < tempArray.length; i++) {
                finalData[i] = tempArray[i].split(/,/).slice(0, columns);
            }
            finalData = JSON.stringify(finalData);
            callback(finalData);
            return finalData;
        });
    }

    getKey() {
        return FS.readFileSync(`data/encryption/cert.key`);
    }

    getCert() {
        return FS.readFileSync(`data/encryption/cert.pem`);
    }
}

module.exports = DataHandler;