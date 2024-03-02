/**
 * Route setup for rendering the home page of the Reviewer module. It includes codes for retrieving document and transaction 
 * details from the database to display on the page.
 * Author/s: Carl Joshua Lalwet
 */
const express = require("express")
const dbservice = require("../../database_service/reviewer_queries");
const router = express.Router()

const db = dbservice.getReviewerService()

router.get('/', (req, res) => {
    if (req.session.user) {
        const userData = db.getReviewerDetails(req.session.user.username)
        userData.then(userData => {
            const revDocs = db.getReviewerDocuments(userData[0].revofc_id)

            revDocs.then(revDocs => {
                let promiseArray = [];

                revDocs.forEach(revDoc => {
                    //Reads through all transactions made. No matter the document status, query will point to the most recent transaction of the document recorded. Results in duplicates.
                    const transaction = db.getLatestDocumentTransaction(revDoc.acct_username, revDoc.doc_title, revDoc.version, userData[0].revofc_id);
                    const promise = transaction.then(transaction => {
                        let docData = '';
                        if (transaction.transacData[0].revofc_id == userData[0].revofc_id) {
                            docData = transaction.transacData[0];
                        }
                        return docData;
                    });
                    promiseArray.push(promise); // Store all promises
                });

                // Wait for all promises to resolve
                Promise.all(promiseArray)
                    .then(duplicatedData => {

                        //removes duplicate entries
                        let docData = Array.from(
                            new Map(duplicatedData.map(item => [`${item.acct_username}-${item.doc_title}-${item.version}`, item]))
                            .values()
                        );

                        if (docData == '') {
                            docData = [];
                        }

                        res.render("./reviewer/reviewer-home.pug", { userData, docData });
                    })
                    .catch(error => {
                        console.error(error);
                        res.status(500).send('Internal Server Error');
                    });
            });



        });
    } else {
        res.redirect("/");
    }
})

module.exports = router