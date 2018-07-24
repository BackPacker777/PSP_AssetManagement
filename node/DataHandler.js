//   todo:

`use strict`;

const FS = require(`fs`);
const SQL = require(`sqlite3`).verbose();

class DataHandler {
    constructor() {
        this.key = FS.readFileSync(`data/encryption/cert.key`);
        this.cert = FS.readFileSync(`data/encryption/cert.pem`);
        this.initDB();
        // this.insertRow();
        // this.queryData(123456);
        // this.db.close();
    }

    initDB() {
        this.db = new SQL.Database(`data/asset_data.db`, (err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log(`Connected to Sqlite3 DB`);
        });
        this.db.run(`CREATE TABLE IF NOT EXISTS psp_assets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        maker TEXT,
        model TEXT,
        tag INTEGER,
        sn TEXT,
        type TEXT,
        description TEXT,
        warranty INTEGER,
        purchaseDate INTEGER,
        isTitle1 INTEGER DEFAULT 0,
        isTitle9 INTEGER DEFAULT 0,
        is31a INTEGER DEFAULT 0
        )`); // https://stackoverflow.com/questions/40645216/check-if-sql-table-exists-in-python
        console.log(`Sqlite table -psp_assets- created`);
        this.db.run(`PRAGMA AUTO_VACUUM = FULL`);
        // date: http://www.sqlitetutorial.net/sqlite-date/
    }

    insertRow(formData) {
        this.db.run(`INSERT INTO psp_assets (maker,model,tag,sn,type,description,warranty,purchaseDate,isTitle1,isTitle9,is31a)
         VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [formData.maker, formData.model, formData.tag, formData.sn, formData.type, formData.description, formData.warranty, formData.purchaseDate, formData.isTitle1, formData.isTitle9, formData.is31a],
            function(err) {
                if (err) {
                    return console.log(err.message);
                }
            }
        );
    }

    getAllItems(callback) {
        this.db.all(`SELECT * FROM psp_assets`, function(err, rows) {
            let data = [];
            rows.forEach(function (row) {
                data.push([row.maker,row.model,row.tag,row.sn,row.type,row.description,row.warranty,row.purchaseDate,row.isTitle1,row.isTitle9,row.is31a]);
            });
            callback(data);
        });
    }

    queryData(assetTag) {
        this.db.get(`SELECT * FROM psp_assets WHERE tag = assetTag`, (error, row) => {
            if (row) {
                console.log(`TRUE`);
            } else {
                console.log(`FALSE`);
            }
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