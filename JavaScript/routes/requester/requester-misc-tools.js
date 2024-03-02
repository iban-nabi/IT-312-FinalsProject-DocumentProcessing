const fs = require('fs');
const tools = require("../../database_service/requester_tools");
const dbTools = tools.getRequesterTools();

let instance = null;
class RequesterMiscTools{
    static getRequesterMiscTools(){
        return instance ? instance : new RequesterMiscTools();
    }
    /**
     * Increment string ids
     * @param {*} currID id
     * @returns incremented id
     * author/s: Jan Ivan Ezra Paguyo
     */
    incrementID(currID){
        let numericPart = parseInt(currID.match(/\d+/)[0]);
        let incrementedNumericPart = numericPart + 1;
        let newNumericPart = incrementedNumericPart.toString().padStart(3, '0');
        let newID = currID.replace(/\d+/, newNumericPart);
        return newID;
    }

    /**
     * Return the currend transaction id from the db
     * @returns transaction id
     * author/s: Jan Ivan Ezra Paguyo
     */
    getTransactionID(){
        return new Promise((resolve,reject)=>{
            dbTools.getCurrentTransactionID()
                .then(data =>{
                    if (data.length === 0){
                        resolve("TRN001");
                    }else{
                        const trnID = data[0].trn_id;
                        resolve(this.incrementID(trnID));
                    }
          
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }

    /**
     * The function updates the filename for a specific pdf including the DOC ID and Version Number
     * @param {*} fileName original document name
     * @param {*} username user
     * @param {*} version version number
     * @returns updated document name 
     * author/s: Jan Ivan Ezra Paguyo
     */
    updateDocumentName(fileName,username,version) {
        return new Promise((resolve, reject) => {
            dbTools.getCurrentDocID(username)
                .then(data => {
                    if (data.length === 0){
                        //data[0].doc_id = "DOC001";
                        data.push({doc_id:"DOC000"});
                    }
                    const currID = data[0].doc_id;
                    const newName = this.incrementID(currID) + `-${version}-` + fileName;
                    resolve(newName);
                })
                .catch((error) => {
                    console.error(error);
                    reject(error);
                });
        });
    }
    

    /**
     * A Function that reads the number of pages of a specific pdf
     * @param {*} filePath file path of the pdf file
     * @param {*} callback callback page count
     * author/s: Jan Ivan Ezra Paguyo
     */
    readNumberOfPages(filePath, callback) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading file:', err);
                callback(err, null);
                return;
            }
            const pageCount = (data.match(/\/Type[\s]*\/Page[^s]/g) || []).length;
            callback(null, pageCount);
        });
    }
}

module.exports = RequesterMiscTools;