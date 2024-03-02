/**
 * Route setup for saving annotations to PDFs. Updates the PDFs in 
 * the uploads folder to include the annotations from PDFTron.
 * Author/s: Carl Joshua Lalwet 
 */
const fs = require('fs');
const multer = require('multer');
const express = require('express');
const router = express.Router();

const upload = multer(); // To handle blob in the server 

// Handle POST request sent to '/annotationHandler.js'
router.post('/', upload.any(), (req, res) => {
  if (req.session.user) {
    try {
      // Write the blob into a PDF file
      res.status(200).send(fs.writeFileSync(`uploads/${req.query.requester}/${decodeURIComponent(req.query.filename)}`, req.files[0].buffer));
    } catch (e) {
      res.status(500);
    }
    res.end();
  } else {
    res.redirect("/");
  }
});

module.exports = router;
