const pool = require("./dbconnection");

const dbservice = require("./common_queries");

const db = dbservice.getCommonService();

let instance = null;
class RequesterService{
    static getRequesterService(){
        return instance ? instance : new RequesterService();
    }

    /**
     * Executes query for getting requeseter details
     * @param {*} username 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getRequesterDetails(username) {
        const query = `
        SELECT 
        a.acct_username,
        a.acct_fname,  
        a.acct_lname,
        a.email,
        a.school_id, 
        s.school_name
        FROM account a 
        NATURAL JOIN school s 
        WHERE a.acct_username = ?`;
        return db.useSELECTQuery(username, query);    
    }

    /**
     * Executes query for getting user requester notifications
     * @param {*} username 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserNotifictation(username){
        console.log("username: "+username);
        const query  = `
        SELECT DISTINCT
        t.trn_status,
           d.doc_title,
           r.dept_name,
           t.version,
           t.trn_date,
           t.trn_id,
           t.notification
        FROM transaction t
        JOIN document d ON d.acct_username = t.acct_username
        JOIN rev_office r ON r.revofc_id = t.revofc_id
        WHERE t.acct_username = ? AND t.trn_status != 'PENDING'
		ORDER BY t.trn_date DESC
        `;
        return db.useSELECTQuery([username], query);
    }

    /**
     * Executes query for getting submission desc by date
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmDescDate(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title

        FROM TRANSACTION t
        JOIN 
            DOCUMENT d ON t.doc_id = d.doc_id
                    AND t.version = d.version
                    AND t.acct_username = d.acct_username
        WHERE 
            d.acct_username = ?
        ORDER BY 
            t.trn_date DESC;
        `;
        return db.useSELECTQuery([accountUsername], query);
    }

    /**
     * Executes query for getting submission asc by date
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmAscDate(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title

        FROM TRANSACTION t
        JOIN 
            DOCUMENT d ON t.doc_id = d.doc_id
                    AND t.version = d.version
                    AND t.acct_username = d.acct_username
        WHERE 
            d.acct_username = ?
        ORDER BY 
            t.trn_date ASC;
        `;

        return db.useSELECTQuery([accountUsername], query);
    }


    /**
     * Executes query for getting submission desc by title
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmDescTitle(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title

        FROM TRANSACTION t
        JOIN 
        DOCUMENT d ON t.doc_id = d.doc_id
                AND t.version = d.version
                AND t.acct_username = d.acct_username
        WHERE 
            d.acct_username = ?
        ORDER BY 
            d.doc_title DESC;
        `;
        return db.useSELECTQuery([accountUsername], query);
    }


    /**
     * Executes query for getting submission asc by title
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmAscTitle(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title

        FROM TRANSACTION t
        JOIN 
        DOCUMENT d ON t.doc_id = d.doc_id
                AND t.version = d.version
                AND t.acct_username = d.acct_username
        WHERE 
            d.acct_username = ?
        ORDER BY 
            d.doc_title ASC;
        `;

        return db.useSELECTQuery([accountUsername], query);
    }

    /**
     * Executes query for getting submission asc by status
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmAscStatus(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title
        FROM TRANSACTION t
        JOIN DOCUMENT d ON t.doc_id = d.doc_id
            AND t.version = d.version
            AND t.acct_username = d.acct_username
        WHERE 
             d.acct_username = ?
        ORDER BY 
            CASE 
                WHEN t.trn_status = 'APPROVED' THEN 1
                WHEN t.trn_status = 'CANCELLED' THEN 2
                WHEN t.trn_status = 'PENDING' THEN 3
                WHEN t.trn_status = 'REVIEWING' THEN 4
        END;`
        return db.useSELECTQuery([accountUsername], query);
    }


    /**
     * Executes query for getting submission desc by status
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getUserSubmDescStatus(accountUsername){
        const query = `
        SELECT
            t.trn_id, 
            t.trn_date, 
            t.doc_id, 
            t.revofc_id, 
            t.trn_status,
            d.doc_title
        FROM TRANSACTION t
        JOIN DOCUMENT d ON t.doc_id = d.doc_id
            AND t.version = d.version
            AND t.acct_username = d.acct_username
        WHERE 
             d.acct_username = ?
        ORDER BY 
            CASE 
                WHEN t.trn_status = 'APPROVED' THEN 4
                WHEN t.trn_status = 'CANCELLED' THEN 3
                WHEN t.trn_status = 'PENDING' THEN 2
                WHEN t.trn_status = 'REVIEWING' THEN 1
        END;`
        
        return db.useSELECTQuery([accountUsername], query);
    }

    /**
     * Executes query for getting document details
     * @param {*} docID 
     * @param {*} accountUsername 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getDocumentDetails(docID, accountUsername){
        const query = `
        SELECT DISTINCT 
            d.acct_username,
            d.doc_id,
            d.doc_title,
            d.doc_type,
            d.file_size,
            d.no_of_pages,
            d.version,
            t.trn_date
        FROM 
            DOCUMENT d
        JOIN 
            TRANSACTION t ON t.doc_id = d.doc_id
        WHERE 
            t.doc_id = ? AND d.acct_username = ?
        ORDER BY d.version DESC
        LIMIT 1;    
        `;

        return db.useSELECTQuery([docID,accountUsername], query);
    }

    /**
     * Executes query for submitting document
     * @param {*} data 
     * author/s: Jan Ivan Ezra Paguyo
     */
    async submitDocument(data){
        pool.query('INSERT INTO document SET ?', data, (error, results) => {
            if (error) throw error;
          });
    }

    /**
     * Executes query for inserting transaction
     * @param {*} data 
     * author/s: Jan Ivan Ezra Paguyo
     */
    async createTransaction(data){
        pool.query('INSERT INTO transaction SET ?', data, (error, results) => {
            if (error) throw error;
          });
    }

    /**
     * Executes query for getting submission status
     * @param {*} docID 
     * @param {*} username 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async viewSumbissionStatus(docID,username){
        const query = `
        SELECT
            T.trn_status,
            R.dept_name,
            A.email,
            T.trn_date
        FROM
            TRANSACTION T
        JOIN
            REV_OFFICE R  ON T.revofc_id = R.revofc_id
        JOIN
            ACCOUNT A ON A.revofc_id = R.revofc_id
        WHERE
            T.doc_id = ? AND T.acct_username=?
        ORDER BY t.trn_id;
        `;

        return db.useSELECTQuery([docID,username], query);
    }

    /**
     * Executes query for getting office queue
     * @param {*} docID 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getQueue(docID){
        const query = `
        SELECT
            R.dept_name
        FROM
            REV_OFFICE R
        `;
        return db.useSELECTQuery(docID, query);
    }

    /**
     * Executes query for getting offices with limit
     * @param {*} limit 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getOffices(limit){
        const query =`
        SELECT
            R.dept_name,
            A.email
        FROM
            REV_OFFICE R
        JOIN
            ACCOUNT A ON R.revofc_id = A.revofc_id
        ORDER BY
            R.revofc_id ASC
        `;
        return db.useSELECTQuery(limit,query);
    }

    /**
     * Executes query for getting pending queue
     * @param {*} docID 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getPendingQueue(docID){
        const query = `
        SELECT
            R.dept_name,
            R.dept_email
        FROM
            QUEUE Q
        JOIN
            REV_OFFICE R ON Q.revofc_id = R.revofc_id
        WHERE
            q.doc_id = ? AND Q.queue_status IS NULL
        ORDER BY
            Q.queue_order;
        `;
        return db.useSELECTQuery(docID, query);
    }

    /**
     * Executes query for getting rejected transaction
     * @param {*} docID 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getIfTransactionRejected(docID){
        const query = `
        SELECT
            T.trn_id,
            T.doc_id,
            T.trn_date,
            T.trn_status,
            R.dept_name
        FROM
            TRANSACTION T
        INNER JOIN
            REV_OFFICE R ON R.revofc_id = T.revofc_id
        WHERE
            T.doc_id = ?
        ORDER BY 
            T.trn_id DESC
		LIMIT 1;
        `;
        return db.useSELECTQuery(docID, query);
    }

    /**
     * Executes query for getting transaction using doc id limit by 1
     * @param {*} docID 
     * @param {*} username 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getCurrentTransactionByDocID(docID,username){
        const query = `
        SELECT 
            t.trn_id,
            t.trn_status
        FROM TRANSACTION t
        WHERE
            t.doc_id = ? AND t.acct_username = ?
        ORDER BY 
            t.trn_id DESC
        LIMIT 1;
        `;

        return db.useSELECTQuery([docID,username],query);
    }


    /**
     * Executes query for getting transaction using trn id limit
     * @param {*} trnID 
     * @param {*} username 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async getCurrentTransactionByTrnID(trnID,username){
        const query = `
        SELECT 
            t.trn_status,
            t.doc_id
        FROM TRANSACTION t
        WHERE
            t.doc_id=? AND t.acct_username= ?
        `;
        return db.useSELECTQuery([trnID,username],query);
    }

    
    /**
     * Executes query for updating pending transaction to query
     * @param {*} docID 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async cancelPendingTransaction(docID){
        const query = `
            UPDATE transaction
            SET trn_status = 'CANCELLED'
            WHERE doc_id = ?;
        `;

        return db.useUPDATEQuery([docID], query);
    }

    async identifyNotif(username){
        const query = `
            SELECT * FROM transaction 
            WHERE acct_username=? 
            AND notification = 0 
            AND trn_status != 'CANCELLED' 
            AND trn_status != 'PENDING'
            LIMIT 1
        `;
        return db.useSELECTQuery(username, query);
    }

    /**
     * Executes query for resubmitting document through update
     * @param {*} docID 
     * @param {*} docTitle 
     * @returns data based on the query
     * author/s: Jan Ivan Ezra Paguyo
     */
    async resubmitDocument(docID, docTitle){
        const query = `
        UPDATE 
            DOCUMENT 
        SET 
            doc_title = ? 
        WHERE 
            doc_id = ?`;
        
        return db.useUPDATEQuery([docTitle, docID], query);
    }

    async updateNotification(trnID){
        const query = 'UPDATE transaction SET notification = 1 WHERE trn_id = ?';
        console.log("pasok");
        return db.useUPDATEQuery([trnID], query);
    }
}

module.exports = RequesterService;
