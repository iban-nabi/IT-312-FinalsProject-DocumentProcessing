const express = require('express');
const fileUpload = require('express-fileupload');
const dbservice = require("../../database_service/requester_queries");
const tools = require("../../database_service/requester_tools");
const miscTools = require("./requester-misc-tools");
const fs = require('fs');
const router = express.Router();

router.use(fileUpload());

const db = dbservice.getRequesterService();

const dbservicecommon = require("../../database_service/common_queries");
const dbc = dbservicecommon.getCommonService();

const dbTools = tools.getRequesterTools();
const reqMiscTools = miscTools.getRequesterMiscTools();

/**
 * Route that displays the submission page for the requester
 * author/s: Jav Ivan Ezra Paguyo
 */
router.get("/", (req,res)=>{
    if(req.session.user){
        res.render("requester/submit");
    }else{
        res.redirect("/login");
    }
});

/**
 * Post route that handles the request upon by the requester by utilizing the processRequest function
 * author/s: Jav Ivan Ezra Paguyo
 */
router.post("/send-request", (req, res) => {
    if (req.session.user) {
        uploadFile(req, res, (success) => {
            if (success) {
                processRequest(req, res);
            } else {
                res.send(String.raw`
                    <script type="module" src="/public/scripts/common/show-alert.js"></script>
                    <script type="module">
                        import { showAlert } from '../../public/scripts/common/show-alert.js';
                        
                        document.addEventListener('DOMContentLoaded', () => {
                            showUpdateResult();

                            function showUpdateResult() {
                                showAlert("Invalid Document Name. Avoid characters such as <, >, :, \\, \", /, ?, |, and *)","").then(result => {
                                    window.location.href = '/submit-document';
                                });
                            }
                        });
                    </script>
                `);
            }
        });
    } else {
        res.redirect("/login");
    }
});

/**
 * Route to redirect to the home page when the cancel button is pressed
 * author/s: Jav Ivan Ezra Paguyo
 */
router.post("/cancel", (req,res)=>{
    if(req.session.user){
        res.redirect('/requester-home');
    }else{
        res.redirect("/login");
    }
})

/**
 * A function that stores the file uploaded by the requester in a specific directory
 * @param {*} req request
 * @param {*} res response
 * @param {*} callback callback
 */
function uploadFile(req, res, callback) {
    if (req.files && req.files.file) {
        console.log("name: "+req.body['document-title']);
        const uploadedFile = req.files.file;
        const documentTitle = `${req.body['document-title']}.pdf`;

        reqMiscTools.updateDocumentName(documentTitle, req.session.user.username, "v1")
            .then((fileName) => {
                createUserDirectory(req.session.user.username);
                filePath = `uploads/${req.session.user.username}/${fileName}`;
                tempFilePath = filePath;

                uploadedFile.mv(filePath, (err) => {
                    if (err) {
                        console.log("Move error");
                        callback(false);
                    } else {
                        callback(true);
                    }
                });
            })
            .catch((error) => {
                console.error(error);
                callback(false);
            });
    } else {
        console.log("no file attached");
        callback(false);
    }
}

/**
 * The function handles the creation of a new transaction and document based on the requester submission for reviewing
 * The route will use these following functions for the database access and manipulation:
 *  getCurrentDocID
 *  submitDocument (create a new document instance in the db)
 *  insertNewTransaction (create a new transaction instance in the db)
 * @param {*} req request
 * @param {*} res response
 * author/s: Jan Ivan Ezra Paguyo
 */
function processRequest(req, res) {
    const uploadedFile = req.files.file;
    const documentType = req.body['docuement-type'];
    const documentTitle = req.body['document-title'];
    const fileSize = uploadedFile.data.length/1048576.0;
    const dataID = dbTools.getCurrentDocID(req.session.user.username);

    dataID.then((data) => {
        if (data.length === 0){
            data.push({doc_id:"DOC000"});
        }

        currID = data[0].doc_id;
        reqMiscTools.readNumberOfPages(filePath, (err, pageCount) => {
            if (err) {
                res.status(500).send(`<h1> Error reading file: ${err.message} </h1>`);
                return;
            }
            const docID = reqMiscTools.incrementID(data[0].doc_id)
            const dataToInsert = documentData(docID, documentType,documentTitle, fileSize, pageCount, req.session.user.username);
            const insertData = db.submitDocument(dataToInsert);

            insertData.then(() => {
                //insert in transaction table
                reqMiscTools.getTransactionID().then(trnID =>{
                    const createTransaction = dbc.insertNewTransaction(trnID, reqMiscTools.incrementID(data[0].doc_id), 1, req.session.user.username, "REVOFC1", "PENDING");
                    createTransaction.then(() => {
                        res.redirect(`/document-details/${docID}`);
                    })
                })
            });
        });
    });
}

/**
 * Creates a directory for a specific user if it is not exisiting under the uploads directory
 * @param {*} username username of the user
 * author/s: Jan Ivan Ezra Paguyo
 */
function createUserDirectory(username){
    var dir = `uploads/${username}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
}

/**
 * Returns a data object for document
 * @param {*} currID
 * @param {*} docType
 * @param {*} fileName 
 * @param {*} fileSize 
 * @param {*} pageCount 
 * @param {*} username 
 * @returns data object document
 * author/s: Jan Ivan Ezra Paguyo
 */
function documentData(currID, docType,fileName, fileSize, pageCount, username){
    return {
        doc_id: currID,
        version: 1,
        doc_type: docType,
        doc_title: fileName,
        file_size: fileSize,
        no_of_pages: pageCount,
        acct_username: username,
    }
}


module.exports = router;