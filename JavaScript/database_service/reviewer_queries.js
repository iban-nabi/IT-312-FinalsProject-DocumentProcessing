const pool = require("./dbconnection");
const dbservice = require("./common_queries");

const db = dbservice.getCommonService();

let instance = null;
/**
 * A class containing all the queries to be used by the Reviewer.
 * Author/s: Carl Joshua Lalwet
 */
class ReviewerService {
    /**
     * Author/s: Carl Joshua Lalwet 
     * @returns An instance of the Reviewer Service.
     */
    static getReviewerService() {
        return instance ? instance : new ReviewerService();
    }

    /**
     * Retrieves Reviewer details from the database.
     * Author/s: Carl Joshua Lalwet 
     * @param {*} username the Reviewer's username
     * @returns Reviewer's full name, email, Office ID, Department Name.
     */
    async getReviewerDetails(username) {
        const query = `
        SELECT 
        a.acct_username,
        a.acct_fname,  
        a.acct_lname,
        a.email,
        r.revofc_id, 
        r.dept_name
        FROM account a 
        NATURAL JOIN rev_office r 
        WHERE a.acct_username = ?`;
        return db.useSELECTQuery(username, query);
    }

    /**
     * Retrieves all documents assigned to the reviewer. Document must be in Pending status.
     * Author/s: Carl Joshua Lalwet 
     * @param {*} revofc_id ID of the reviewer
     * @returns Documents Pending for review
     */
    async getReviewerDocuments(revofc_id) {
        const query = `
        SELECT d.doc_id, d.doc_title, d.version, d.doc_type, d.file_size, d.no_of_pages,
        a.acct_username, a.acct_fname, a.acct_lname, 
        s.school_name,
        t.trn_date, t.trn_status
        FROM transaction t 
        join document d using (doc_id, version, acct_username)
        join account a using (acct_username)
        join school s using (school_id) WHERE t.revofc_id = ? ORDER BY t.trn_date DESC`;
        return db.useSELECTQuery(revofc_id, query)
    }


    /**
     * Gets all data associated with a specific document, as well as the last trn_id in the transactions table
     * Author/s: Carl Joshua Lalwet 
     * @param {*} requester of the document
     * @param {*} filename of the document
     * @param {*} version of the document
     * @returns last: the last trn_id, transacData: the data of the specified document
     */
    async getLatestDocumentTransaction(requester, filename, version, revofc) {
        const query1 = `
        SELECT trn_id FROM transaction ORDER BY trn_id DESC LIMIT 1`;
        const last = await db.useSELECTQueryNoParams(query1)
        const query2 = `
        SELECT d.doc_id, d.doc_title, d.version, d.doc_type, d.file_size, d.no_of_pages,
        a.acct_username, a.acct_fname, a.acct_lname, 
        s.school_name,
        t.trn_id, t.trn_date, t.trn_status, t.revofc_id
        FROM transaction t 
        join document d using (doc_id, version, acct_username)
        join account a using (acct_username)
        join school s using (school_id) WHERE acct_username = ? AND d.doc_title = ? AND version = ? AND t.revofc_id = ? ORDER BY trn_id DESC LIMIT 1`;
        const transacData = await db.useSELECTQuery([requester, filename, version, revofc], query2)
        return { last, transacData };
    }
    async getRemarks(trnID) {
        const query = `SELECT remarks FROM transaction WHERE trn_id = ?`;
        return db.useSELECTQuery(trnID, query);
    }

}

module.exports = ReviewerService;