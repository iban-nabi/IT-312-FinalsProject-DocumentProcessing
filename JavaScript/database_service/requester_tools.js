const pool = require("./dbconnection");

let instance = null;
class RequesterTools{
    static getRequesterTools(){
        return instance ? instance : new RequesterTools();
    }

    async getCurrentDocID(username){
        console.log("username: "+username);
      const query = `
      SELECT doc_id
        FROM DOCUMENT
      WHERE
        acct_username = ?
      ORDER BY 
        doc_id DESC
      LIMIT 1
      `; 

      return this.useSELECTQuery(username,query);
    }

    async getCurrentTransactionID(){
        const query = `
        SELECT trn_id 
            FROM transaction 
        ORDER BY 
            trn_id DESC 
        LIMIT 1
        `;
        return this.useSELECTQuery("",query);
    }

    async getTransDetsForResubmit(docID,username){
        const query = `
        SELECT 
            D.doc_title,
            t.version,
            D.doc_type,
            t.revofc_id,
            t.trn_id
        FROM 
            document D
        JOIN
            transaction T ON d.doc_id = t.doc_id
        WHERE
            d.doc_id = ? AND d.acct_username  = ?
        ORDER BY trn_id 
        DESC LIMIT 1
        `;
        return this.useSELECTQuery([docID,username], query);
    }

    async verifyForSubmission (username){
        const query = `
        SELECT 
            trn_status
        FROM
            TRANSACTION
        WHERE acct_username = ?
        ORDER BY trn_id DESC LIMIT 1 
        `;
        return this.useSELECTQuery([username],query);
    }

    //execute SELECT query
    async useSELECTQuery(parameter,query){
        try {
            let response = await new Promise((res,req)=>{
                 pool.query(query, parameter ,(err,results)=>{
                     if(err){
                         PromiseRejectionEvent(new Error(err.message));
                     }else{
                         res(results);
                     }
                 });
            });
            return response;
         } catch (error) {
             console.log(error);
         }
    }
}

module.exports = RequesterTools;