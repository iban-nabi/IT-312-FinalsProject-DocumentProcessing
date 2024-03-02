const express = require('express');
const fileUpload = require('express-fileupload');
const dbservice = require("../../database_service/requester_queries");
const tools = require("../../database_service/requester_tools");
const miscTools = require("./requester-misc-tools");
const router = express.Router();

const db = dbservice.getRequesterService();
const dbTools = tools.getRequesterTools();
const reqMiscTools = miscTools.getRequesterMiscTools();
router.use(fileUpload());

var docIDHolder = null;

/**
 * Route that displays the resubmit page for the requester
 * author/s: Jav Ivan Ezra Paguyo
 */
router.get("/resubmit-document", (req,res)=>{
    if(req.session.user){
        const forSubmission = dbTools.verifyForSubmission(req.session.user.username)
        
        forSubmission.then(data=>{
            try {
                if(data[0].trn_status==='RETURNED'){
                    res.render("requester/resubmit");

                }else{
                    res.redirect("/requester-home");
                } 

            } catch (error) {
                res.redirect("/requester-home");
            }
        })
    }else{
        res.redirect("/login");
    }
});

/**
 * A post route that handles resubmitting functionalities of the website under requester
 * The route will use these following functions for the database access and manipulation:
 *  getTransDetsForResubmit
 *  getTransactionID
 *  createTransaction (create a new transaction instance)
 * author/s: Jav Ivan Ezra Paguyo
 */
router.post("/resubmit-document/update", (req,res)=>{
    if(req.session.user){
        const transDetails = dbTools.getTransDetsForResubmit(docIDHolder, req.session.user.username);

        // read the current version number of specific doc
        transDetails.then(data=>{
            data[0].version++;

            uploadFile(req, res, `v${data[0].version}`, data[0].doc_title, (success) => {
                if (success) {
                    const uploadedFile = req.files.file;
                    const fileSize = uploadedFile.data.length/1048576.0;
                    const fileName = docIDHolder+"-"+`v${data[0].version}`+"-"+data[0].doc_title+".pdf";
                    const filePath = `uploads/${req.session.user.username}/${fileName}`;

                    reqMiscTools.readNumberOfPages(filePath, (err, pageCount) => {
                        const docToInsert = documentData(docIDHolder, data[0].version, data[0].doc_type , data[0].doc_title, fileSize, pageCount, req.session.user.username);
                        const insertData = db.submitDocument(docToInsert);

                        insertData.then(() => {
                            reqMiscTools.getTransactionID().then(trnID => {
                                const createTransaction = db.createTransaction(transactiontData(trnID, docIDHolder, data[0].version, req.session.user.username, data[0].revofc_id, "PENDING", 0));
                                
                                createTransaction.then(() => {
                                    res.send(` 
                                        <script type="module" src="/public/scripts/common/show-alert.js"></script>
                                        <script type="module">
                                            import { showAlert } from '../../public/scripts/common/show-alert.js';
                                        
                                            document.addEventListener('DOMContentLoaded', () => {
                                                showUpdateResult();
            
                                                function showUpdateResult() {
                                                    showAlert("You have successfully resubmitted the document","").then(result => {
                                                        window.location.href = '/requester-home';
                                                    });
                                                }
                                            });
                                        </script>
                                    `);
                                })
                            });
                        });
                    })

                } else {
                    res.status(500).send(` 
                    <script type="module" src="/public/scripts/common/show-alert.js"></script>
                    <script type="module">
                        import { showAlert } from '../../public/scripts/common/show-alert.js';
                    
                        document.addEventListener('DOMContentLoaded', () => {
                            showUpdateResult();

                            function showUpdateResult() {
                                showAlert("File Upload Failed", "").then(result => {
                                    window.location.href = '/requester-home';
                                });
                            }
                        });
                    </script>
                `);
                }
            });
        });
    }else{
        res.redirect("/login");
    }
});

/**
 * Route for displaying if the pending document will be cancelled. If it is cancelled and the reviewer has not reviewed it yet, it
 * will display a notifcation that the transaction has been cancelled, else it will display that it cannot be cancelled.
 * The route will use these following functions for the database access and manipulation:
 *  getCurrentTransactionByTrnID
 *  cancelPendingTransaction (cancels a specfic transaction)
 * author/s: Jav Ivan Ezra Paguyo
 */
router.get("/cancel/:id", (req, res) => {
    req.params.id;
    if (req.session.user) {
        const transactionData = db.getCurrentTransactionByTrnID(req.params.id,req.session.user.username);
        transactionData.then(data => {
            try {
                if (data[0].trn_status === "PENDING" && data.length==1) {
                const cancelTransaction = db.cancelPendingTransaction(req.params.id);
                cancelTransaction.then(() => {
                    console.log("pasok 3");
                    res.send(` 
                    <script type="module" src="/public/scripts/common/show-alert.js"></script>>
                    <script type="module">
                        import { showAlert } from '../../public/scripts/common/show-alert.js';
                    
                        document.addEventListener('DOMContentLoaded', () => {
                            showUpdateResult();
    
                            function showUpdateResult() {
                                showAlert("Request Successfully Cancelled","").then(result => {
                                    window.location.href = '/requester-home';
                                });
                            }
                        });
                    </script>
                `);
                });
                } else {
                    res.send(` 
                    <script type="module" src="/public/scripts/common/show-alert.js"></script>
                    <script type="module">
                        import { showAlert } from '../../public/scripts/common/show-alert.js';
                    
                        document.addEventListener('DOMContentLoaded', () => {
                            showUpdateResult();
    
                            function showUpdateResult() {
                                showAlert("Cannot Cancel Request","").then(result => {
                                    window.location.href = '/document-details/${data[0].doc_id}';
                                });
                            }
                        });
                    </script>
                `);
                }
            } catch (error) {
                res.redirect("/requester-home");
            }
  
        })
    } else {
        res.redirect("/login");
    }
})


/**
 * Route for displaying the status page for the requester side. If the current transaction is still pending and only has one
 * instance in the transaction table, then it will display a pending page, otherwise it will display the status in regards with
 * the submitted document
 * The route will use these following functions for the database access and manipulation:
 *  getDocumentDetails
 * author/s: Jav Ivan Ezra Paguyo
 */
router.get("/:id", async (req, res) => {
    req.params.id;
    if (req.session.user) {
        const documentDetailsData = db.getDocumentDetails(req.params.id, req.session.user.username);  // process document details
        documentDetailsData.then(data => {
            if (data.length === 1) {
                let docID = data[0].doc_id;
                docIDHolder = docID;

                db.viewSumbissionStatus(docID, req.session.user.username)
                    .then(async (documentStatus) => {
                        let submissionData = await sortDataSubmission(documentStatus);

                        if (documentStatus.length === 1 && submissionData[0].status==='PENDING') {
                            const queue = db.getQueue(docID);

                            queue.then(queueData => {
                                const transactionData = db.getCurrentTransactionByDocID(docID, req.session.user.username);
                                transactionData.then(transactionData => {
                                    res.render("requester/pending", { data, queueData, transactionData });
                                });

                            })
                        } else {
                            res.render("requester/status", {
                                data,
                                submissionData
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        res.redirect("/requester-home");
                    });
            } else {
                res.redirect("/requester-home");
            }
        });
    } else {
        res.redirect("/login");
    }
});

/**
 * Submission structure to be used for displaying
 * author/s: Jav Ivan Ezra Paguyo
 */
function SubmissionStructure() {
    this.status = null;
    this.reviewer = null;
    this.email = null;
    this.date_of_approval = null;
    this.date_reviewed = null;
    this.date_received = null;
    this.date_returned = null;
}

/**
 * Creates a data object for document table
 * @param {*} docID document id
 * @param {*} version version
 * @param {*} docType doc type
 * @param {*} fileName file name
 * @param {*} fileSize files size
 * @param {*} pageCount page count
 * @param {*} username username
 * @returns document table object
 * author/s: Jav Ivan Ezra Paguyo
 */
function documentData(docID, version, docType, fileName, fileSize, pageCount, username) {
    return {
        doc_id: docID,
        version: version,
        doc_type: docType,
        doc_title: fileName,
        file_size: fileSize,
        no_of_pages: pageCount,
        acct_username: username,
    }
}

/**
 * Creates a data object for transaction table
 * @param {*} trnID transaction id
 * @param {*} docID  document id
 * @param {*} version  version
 * @param {*} username  username
 * @param {*} revofcID  revofc id
 * @param {*} status  status
 * @param {*} notification  notification
 * @returns data object transaction
 * author/s: Jav Ivan Ezra Paguyo
 */
function transactiontData(trnID, docID, version, username, revofcID, status, notification) {
    return {
        trn_id: trnID,
        doc_id: docID,
        version: version,
        acct_username: username,
        revofc_id: revofcID,
        trn_status: status,
        notification: notification
    }
}

/**
 * Sorts the list of the transaction data in order to identify the current status, date reviewed, date accepted, date returned
 * @param {*} data list of transaction of a specific user document
 * @returns a sorted list of transaction for specific offices in regards with the submission status
 * author/s: Jav Ivan Ezra Paguyo
 */
function sortDataSubmission(data) {
    let compiledData = [];
    let office = "";
    let submission = null;

    for (let i = 0; i < data.length; i++) {
        if (office !== data[i].dept_name) {
            if (office !== "") {
                compiledData.push(submission);
            }
            office = data[i].dept_name;
            submission = new SubmissionStructure();
            submission.status = data[i].trn_status
            submission.reviewer = data[i].dept_name;
            submission.email = data[i].email;

            if (data[i].trn_status === "PENDING") {
                submission.date_received = formatRequestDate(data[i].trn_date);
            }

        } else {
            if (data[i].trn_status === "PENDING" && submission.date_received !== null) {
                submission.date_received = formatRequestDate(data[i].trn_date);
                submission.date_reviewed = null;
                submission.date_of_approval = null;
                submission.date_returned = null;
            }

            if (data[i].trn_status === "REVIEWING") {
                submission.date_reviewed = formatRequestDate(data[i].trn_date);
            }

            if (data[i].trn_status === "APPROVED") {
                submission.date_of_approval = formatRequestDate(data[i].trn_date);
                if(submission.date_reviewed===null){
                    submission.date_reviewed = formatRequestDate(data[i].trn_date);
                }
            }

            if (data[i].trn_status === "RETURNED") {
                submission.date_returned = formatRequestDate(data[i].trn_date);
                if(submission.date_reviewed===null){
                    submission.date_reviewed = formatRequestDate(data[i].trn_date);
                }
            }
            submission.status = data[i].trn_status
        }
    }
    compiledData.push(submission);

    if (compiledData.length != 5) {
        compiledData = populatePending(compiledData);
    }

    return compiledData
}

/**
 * The function that insert sthe other offices that did not reviewed the document
 * @param {*} compiledData data to be displayed in regards with the submission status
 * @returns updated compiled data
 * author/s: Jav Ivan Ezra Paguyo
 */
async function populatePending(compiledData) {
    try {
        // const pendingOffices = await db.getPendingQueue(docID);
        const pendingOffices = await db.getOffices();

        for (let i = compiledData.length; i < pendingOffices.length; i++) {
            var element = pendingOffices[i];
            let temp = new SubmissionStructure();
            temp.status = null;
            temp.reviewer = element.dept_name;
            temp.email = element.email;
            temp.date_of_approval = null;
            temp.date_reviewed = null;
            temp.date_received = null;
            compiledData.push(temp);
        }

        return compiledData;

    } catch (error) {
        console.error(error);
        throw error;
    }
}

/**
 * Formats a date ojbect to a MM-DD-YYYY format
 * @param {*} date 
 * @returns formated date
 * author/s: Jav Ivan Ezra Paguyo
 */
function formatRequestDate(date) {
    const parseDate = new Date(date);

    const options = { month: 'short', day: '2-digit', year: 'numeric' };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(parseDate);
    return formattedDate;
}

/**
 * A function that stores the file re uploaded by the requester in a specific directory
 * @param {*} req request
 * @param {*} res response
 * @param {*} version version number of the file
 * @param {*} documentTitle title of the uploaded document
 * @param {*} callback callback
 * author/s: Jan Ivan Ezra Paguyo
 */

function uploadFile(req, res, version, documentTitle, callback) {
    if (req.files && req.files.file) {
        const uploadedFile = req.files.file;
        let fileName = docIDHolder+"-"+version+"-"+documentTitle+".pdf";
        let filePath = `uploads/${req.session.user.username}/${fileName}`;

        uploadedFile.mv(filePath, (err) => {
            if (err) {
                callback(false);
            } else {
                callback(true);
            }
        });

    } else {
        callback(false);
    }
}

module.exports = router;