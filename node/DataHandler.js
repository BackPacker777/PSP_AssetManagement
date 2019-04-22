//   todo:

`use strict`;

const FS = require(`fs`);
const SQL = require(`sqlite3`).verbose();

class DataHandler {
    constructor() {
        // this.key = FS.readFileSync(`data/encryption/key.pem`);
        // this.cert = FS.readFileSync(`data/encryption/cert.pem`);
        this.initDB();
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
        id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE,
        maker TEXT,
        model TEXT,
        tag INTEGER NOT NULL UNIQUE,
        sn TEXT,
        type TEXT,
        description TEXT,
        warranty INTEGER,
        purchaseDate INTEGER,
        location TEXT,
        bad INTEGER DEFAULT 0,
        isTitle1 INTEGER DEFAULT 0,
        isTitle9 INTEGER DEFAULT 0,
        is31a INTEGER DEFAULT 0
        )`); // https://stackoverflow.com/questions/40645216/check-if-sql-table-exists-in-python
        console.log(`Sqlite table -psp_assets- created`);
        this.db.run(`PRAGMA AUTO_VACUUM = FULL`);
        // date: http://www.sqlitetutorial.net/sqlite-date/
    }

    insertRow(formData) {
        let self = this;
        for (const key in formData) {
            formData[key] = formData[key].toUpperCase();
        }
        this.db.serialize(() => {
            this.db.get(`SELECT * FROM psp_assets WHERE tag = ?`, formData.tag, function(err, row) {
                if (row) {
                    let sql = `UPDATE psp_assets SET maker = ?, model = ?, sn = ?, type = ?, description = ?, warranty = ?, purchaseDate = ?, location = ?, bad = ?, isTitle1 = ?, isTitle9 = ?, is31a = ? WHERE tag = ?`;
                    self.db.run(sql,[formData.maker, formData.model, formData.sn, formData.type, formData.description, formData.warranty, formData.purchaseDate, formData.location, formData.bad, formData.isTitle1, formData.isTitle9, formData.is31a, formData.tag], function(err) {
                        if (err) {
                            return console.log(err.message);
                        }
                    });
                } else {
                    self.db.run(`INSERT INTO psp_assets (maker,model,tag,sn,type,description,warranty,purchaseDate,location,bad,isTitle1,isTitle9,is31a)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [formData.maker, formData.model, formData.tag, formData.sn, formData.type, formData.description, formData.warranty, formData.purchaseDate, formData.location, formData.bad, formData.isTitle1, formData.isTitle9, formData.is31a],
                        function(err) {
                            if (err) {
                                return console.log(err.message);
                            }
                        }
                    );
                }
            });
        });
    }

    getAllAssets(callback) {
        this.db.all(`SELECT * FROM psp_assets`, function(err, rows) {
            let data = [];
            rows.forEach(function (row) {
                // Uncomment line below if you want to return more item info
                // data.push([row.maker,row.model,row.tag,row.sn,row.type,row.description,row.warranty,row.purchaseDate,row.isTitle1,row.isTitle9,row.is31a]);
                data.push([row.tag,row.location,row.maker,row.model]);
            });
            callback(data);
        });
    }

    deleteAssets(assets) {
        assets = JSON.parse(assets);
        for (let item of assets) {
            this.db.run(`DELETE FROM psp_assets where tag = ?`, [item]);
        }
        this.db.close();
    }

    queryData(itemAttributes, callback) {
        let assetFind = itemAttributes.split(',');
        let sql = `SELECT * FROM psp_assets WHERE ${assetFind[0]} = ?`;
        this.db.all(sql, assetFind[1], function(error, rows) {
            if (error) {
                console.log(error);
            } else {
                let data = [];
                rows.forEach(function (row) {
                    data.push([row.tag,row.location,row.maker,row.model]);
                });
                callback(data);
            }
        });
    }

    queryTag(data, callback) {
        let sql = `SELECT * FROM psp_assets WHERE tag = ?`;
        this.db.all(sql, data, function(error, rows) {
            if (error) {
                console.log(error);
            } else if (rows.length > 0) {
                callback(true);
            } else {
                callback(false);
            }
        });
    }

    queryEditTag(tag, callback) {
        let sql = `SELECT * FROM psp_assets WHERE tag = ?`;
        this.db.get(sql, tag, function(error, rows) {
            if (error) {
                console.log(error);
            } else {
                callback(rows);
            }
        });
    }

    static getAssetData(whichData, callback) {
        let filePath;
        if (whichData === "info") {
            filePath = 'data/asset_info.csv';
        } else {
            filePath = 'data/asset_models.csv';
        }
        FS.readFile(filePath, 'utf8', (err, file) => {
            let tempArray, finalData = [];
            tempArray = file.split(/\r?\n/); //remove newlines
            for (let i = 0; i < tempArray.length; i++) {
                finalData[i] = tempArray[i].split(/,/);
            }
            callback(finalData);
        });
    }

    static renderDom(path, contentType, callback, encoding) {
        FS.readFile(path, encoding ? encoding : `utf-8`, (error, string) => {
            callback(error, string, contentType);
        });
    }

    static getKey() {
        return FS.readFileSync(`data/encryption/key.pem`);
    }

    static getCert() {
        return FS.readFileSync(`data/encryption/cert.pem`);
    }
}

module.exports = DataHandler;