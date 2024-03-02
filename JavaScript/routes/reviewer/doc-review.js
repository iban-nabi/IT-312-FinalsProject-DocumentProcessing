/**
 * Route setup for rendering the page containing the PDFTron API, 
 * allowing for document annotation or basic PDF viewing.
 * Also handles inserting new records into Transaction table, based 
 * on the different document statuses after being reviewed 
 * (REVIEWING, RETURNED, APPROVED)
 * Author/s: Carl Joshua Lalwet
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs')
const dbservice = require("../../database_service/common_queries");
const db = dbservice.getCommonService()

const dbrservice = require("../../database_service/reviewer_queries");
const dbr = dbrservice.getReviewerService();

router.use(express.static(path.join(__dirname, '../public')));
router.use(express.json());

//Not allowing GET requests at this route.
router.get('/', (req, res) => {
    res.redirect("/");
});

//Used when starting a document review with annotations.
router.post('/', (req, res) => {
    if (req.session.user) {
        const filenamePDF = decodeURIComponent(req.body.filenamePDF);
        const user = decodeURIComponent(req.body.deptName);
        const pdfName = decodeURIComponent(req.body.docTitle);
        const pdfVersion = decodeURIComponent(req.body.docVersion);
        const requester = decodeURIComponent(req.body.requester);
        const docType = decodeURIComponent(req.body.docType);
        const docSize = decodeURIComponent(req.body.docSize);
        const pageNum = decodeURIComponent(req.body.pageNum);
        const reqDate = decodeURIComponent(req.body.reqDate);
        const revofcid = decodeURIComponent(req.body.revofcid);
        const trnid = decodeURIComponent(req.body.trnid);

        const remarks = dbr.getRemarks(trnid);
        remarks.then(remarks => {
            const remarksText = remarks[0].remarks;
            res.render("reviewer/doc-review.pug", { filenamePDF, user, pdfName, pdfVersion, requester, docType, docSize, pageNum, reqDate, revofcid, remarksText });
        })
    } else {
        res.redirect("/");
    }
});

//Used when starting a document review as view-only.
router.post('/view', (req, res) => {
    if (req.session.user) {
        const filenamePDF = decodeURIComponent(req.body.filenamePDF);
        const user = decodeURIComponent(req.body.deptName) + "-viewer";
        const pdfName = decodeURIComponent(req.body.docTitle);
        const pdfVersion = decodeURIComponent(req.body.docVersion);
        const requester = decodeURIComponent(req.body.requester);
        const docType = decodeURIComponent(req.body.docType);
        const docSize = decodeURIComponent(req.body.docSize);
        const pageNum = decodeURIComponent(req.body.pageNum);
        const reqDate = decodeURIComponent(req.body.reqDate);
        res.render("reviewer/doc-review.pug", { filenamePDF, user, pdfName, pdfVersion, requester, docType, docSize, pageNum, reqDate });
    } else {
        res.redirect("/");
    }
});

//Used to handle the outcome of the document review. Inserts a new transaction based on status (REVIEWING, RETURNED, APPROVED)
router.post('/:status', (req, res) => {
    if (req.session.user) {
        const requester = req.body.requester;
        const title = req.body.title;
        const version = req.body.version;
        const revofcid = req.body.reviewer;
        const remarks = req.body.remarks;
        const transaction = dbr.getLatestDocumentTransaction(requester, title, version, revofcid);
        transaction.then(transaction => {
            let oldTrn_id = transaction.last[0].trn_id;

            let newTrn_id = increment(oldTrn_id);

            const trnData = transaction.transacData[0];

            let insertPromise;
            if (req.params.status == "reviewing") {
                insertPromise = db.insertNewTransaction(
                    newTrn_id,
                    trnData.doc_id,
                    trnData.version,
                    trnData.acct_username,
                    trnData.revofc_id,
                    "REVIEWING"
                );
            } else if (req.params.status == "return") {
                insertPromise = db.insertNewTransaction(
                    newTrn_id,
                    trnData.doc_id,
                    trnData.version,
                    trnData.acct_username,
                    trnData.revofc_id,
                    "RETURNED"
                );
            } else if (req.params.status == "approve") {
                if (!trnData.revofc_id.endsWith("5")) {
                    insertPromise = db.insertNewTransaction(
                        newTrn_id,
                        trnData.doc_id,
                        trnData.version,
                        trnData.acct_username,
                        trnData.revofc_id,
                        "APPROVED"
                    ).then(() => {
                        let newOfcTrn_id = increment(newTrn_id);
                        let oldOfc_id = trnData.revofc_id;
                        let newOfc_id = oldOfc_id.slice(0, -1) + (parseInt(oldOfc_id.slice(-1)) + 1).toString();

                        // Introduce a 1-second delay so that there is a gap between approved and pending time
                        setTimeout(() => {
                            insertPromise = db.insertNewTransaction(
                                newOfcTrn_id,
                                trnData.doc_id,
                                trnData.version,
                                trnData.acct_username,
                                newOfc_id,
                                "PENDING",
                                remarks
                            );
                        }, 1000);
                    }).catch(() => {
                        res.status(500).end();
                    });
                } else {
                    insertPromise = db.insertNewTransaction(
                        newTrn_id,
                        trnData.doc_id,
                        trnData.version,
                        trnData.acct_username,
                        trnData.revofc_id,
                        "APPROVED"
                    );
                }
            }


            insertPromise.then(() => {
                res.status(200).end();
            }).catch(() => {
                res.status(500).end();
            })
        }).catch(() => {
            res.status(500).end();
        })
    } else {
        res.redirect("/");
    }
})

module.exports = router;

/**
 * Increments the provided Primary Key. 
 * @param {*} oldTrn_id format must be TRNxxx where x = integer.
 * @returns TRNxxx + 1.
 */
function increment(oldTrn_id) {
    return oldTrn_id.slice(0, -3) + (parseInt(oldTrn_id.slice(-3)) + 1).toString().padStart(3, '0');
}

