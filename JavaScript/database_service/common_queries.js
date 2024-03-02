const pool = require("./dbconnection");
const { encryptString }  = require("../public/scripts/common/encryption.js");
const secretKey = Buffer.from('b36cdff9bdaeb3dbd39c4d308eaff2ca524f27b4f9db9071e4f2248e51989a43', 'hex');
const pass1 = 'admin';
const pass2 = 'requester';
const pass3 = 'reviewer';

console.log("Encrypted version of ["+pass1+"]: "+encryptString(pass1, secretKey))
console.log("Encrypted version of ["+pass2+"]: "+encryptString(pass2, secretKey))
console.log("Encrypted version of ["+pass3+"]: "+encryptString(pass3, secretKey))


let instance = null;
class CommonService {
    static getCommonService() {
        return instance ? instance : new CommonService();
    }

    /**
     * Verify the username and password function
     * @param {*} username username of the user
     * @param {*} password password of the user
     * @returns response for login
     */
    async verifyUser(username, password) {
        const encryptedEntered = encryptString(password, secretKey);
        try {
            const response = await new Promise((res, req) => {
                const query = `SELECT * FROM account LEFT JOIN rev_office USING (revofc_id) WHERE acct_username = ? AND password = ?`;
                pool.query(query, [username, encryptedEntered], (err, results) => {
                    if (err) {
                        PromiseRejectionEvent(new Error(err.message));
                        response = [];
                    } else {
                        res(results);
                    }
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Insert new transaction
     * @param {*} trn_id 
     * @param {*} doc_id 
     * @param {*} version 
     * @param {*} acct_username 
     * @param {*} revofc_id 
     * @param {*} trn_status 
     * @returns response
     */
    async insertNewTransaction(trn_id, doc_id, version, acct_username, revofc_id, trn_status, remarks) {
        const query = `
        INSERT INTO transaction 
        (trn_id, trn_date, doc_id, version, acct_username, revofc_id, trn_status, remarks) 
        VALUES 
        (?, NOW(), ?, ?, ?, ?, ?, ?)`;
        return this.useINSERTQuery([trn_id, doc_id, version, acct_username, revofc_id, trn_status, remarks], query)
    }

    /**
     * Executes select query with parameters
     * @param {*} query query to be used
     * @returns data based from the query
     */
    async useSELECTQuery(parameter, query) {
        try {
            let response = await new Promise((resolve, reject) => {
                pool.query(query, parameter, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Executes select query with no parameters
     * @param {*} query query to be used
     * @returns data based from the query
     */
    async useSELECTQueryNoParams(query) {
        try {
            let response = await new Promise((resolve, reject) => {
                pool.query(query, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
            return response;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Executes insert queries
     * @param {*} query query to be used
     */
    async useINSERTQuery(parameter, query) {
        try {
            let response = await new Promise((resolve, reject) => {
                pool.query(query, parameter, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    }


    /**
     * Executes update queries
     * @param {*} query query to be used
     * @returns boolean flag
     */
    async useUPDATEQuery(parameter, query) {
        let flag = true;
        try {
            let response = await new Promise((resolve, reject) => {
                pool.query(query, parameter, (err, results) => {
                    if (err) {
                        reject(new Error(err.message));
                        flag = false;
                    } else {
                        resolve(results);
                    }
                });
            });
            return flag;
        } catch (error) {
            console.log(error);
        }
    }

}



module.exports = CommonService;