/**
 * Route setup for fetching PDF files from the uploads directory, which it then sends over to the 
 * PDFTron API to be annotated or viewed.
 * Author/s: Carl Joshua Lalwet
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get("/:reqName/:fileName/:version/:reviewer", (req, res) => {
    if (req.session.user &&
        (req.session.user.deptName == req.params.reviewer || req.session.user.username == req.params.reqName)
    ) {
        const requester = req.params.reqName;
        const fileName = req.params.fileName;
        const version = req.params.version;
        const filePath = path.join(__dirname, `../../uploads/${requester}`);

        fs.readdir(filePath, (err, files) => {
            if (err || !files) {
                if (err && err.code === 'ENOENT') {
                    console.error("Directory not found:", err);
                    res.status(404).send('Directory not found'); // Send a 404 error if the directory isn't found
                } else {
                    console.error("Error reading directory:", err);
                    res.status(500).send('Internal Server Error'); // Send a generic 500 error for other errors
                }
            }

            if (files) {
                files.forEach(file => {
                    if (file.includes(fileName)) {
                        const ver = file.replace(fileName, "");
                        console.log(`Match found! The fileName "${fileName}" refers to the file "${file}".`);
                        if (ver.endsWith(`-v${version}-.pdf`)) {
                            res.status(200).sendFile(path.join(filePath, file));
                        }
                    }
                });
            }
        })
    } else {
        res.redirect("/")
    }

});

module.exports = router;