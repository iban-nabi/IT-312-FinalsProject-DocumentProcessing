const express = require('express');
const dbservice = require("../../database_service/requester_queries");
const router = express.Router();

const db = dbservice.getRequesterService();

/**
 * Route for displaying requester-home page
 * author/s: Jan Ivan Ezra Paguyo
 */
router.get('/', (req, res)=>{
    if (req.session.user) {
        const userDetails = db.getRequesterDetails(req.session.user.username);
        userDetails.then(userDetails => {
            const userType = req.session.user.acctType;
            if(userType === 'REQUESTER'){
                const data = db.getUserSubmDescDate(req.session.user.username);
                data.then(data =>{
                    var finalData = sortDataAttributes(data);
                    console.log(finalData);
                    res.render("requester/home-main", {
                        user:req.session.user.username, 
                        fname:req.session.user.firstName,
                        lname:req.session.user.lastName,
                        finalData, 
                        userDetails});
                });
            }else if(userType === 'REVIEWER'){
                res.status(404).send("Invalid Access");
            }
        })
    }else{
        res.redirect("/login");
    } 
});

/**
 * Route for displaying the requester-home page where sorting options are applied
 * author/s: Jan Ivan Ezra Paguyo
 */
router.get('/sort', (req,res) =>{
    if (req.session.user) {
        const userDetails = db.getRequesterDetails(req.session.user.username);
        userDetails.then(userDetails => {
            const userType = req.session.user.acctType;
            if(userType === 'REQUESTER'){
                const sortBy = req.query.sort;
                const orderBy = req.query.order;
                const data = identifySorting(sortBy,orderBy,req.session.user.username);
                data.then(data =>{
                var finalData = sortDataAttributes(data);
                    console.log(finalData)
                    res.render("requester/home-main", {
                        user:req.session.user.username, 
                        fname:req.session.user.firstName,
                        lname:req.session.user.lastName,
                        finalData, 
                        userDetails});
                });
            }else if(userType === 'REVIEWER'){
                res.status(404).send("Invalid Access");
            }
        })
    }else{
        res.redirect("/login");
    }
});

/**
 * The function identifies what database function to use depending on the sorting option
 * @param {*} sortBy sort by identification
 * @param {*} orderBy order by identication
 * @param {*} username 
 * @returns database function depending on the sorting options
 * author/s: Jan Ivan Ezra Paguyo
 */
function identifySorting(sortBy,orderBy, username){
    let data;
    if(sortBy==='title' && orderBy==='desc'){
        data = db.getUserSubmDescTitle(username);

    }else if(sortBy==='title' && orderBy==='asc'){
        data = db.getUserSubmAscTitle(username);

    }else if(sortBy==='status' && orderBy==='desc'){
        console.log("pasok");
        data = db.getUserSubmDescStatus(username);

    }else if(sortBy==='status' && orderBy==='asc'){
        data = db.getUserSubmAscStatus(username);

    }else if(sortBy==='date' && orderBy==='desc'){
        data = db.getUserSubmDescDate(username);

    }else if(sortBy==='date' && orderBy==='asc'){
        data = db.getUserSubmAscDate(username);
    }

    return data;
}

/**
 * The function sorts the data array (transaction details of the specific requester)
 * This will compile all transactions depending on the doc_id
 * Then it will call the compileFinalData function
 * @param {*} data array of transactions
 * @returns data array for the requester-home display
 */
function sortDataAttributes(data){
    const compiledData = {};
    // read each data
    data.forEach((rowData) => {
        const { doc_id, trn_date, trn_status, doc_title, trn_id } = rowData;
        // Check if the doc_id already exists in compiledData, if not initialize an array to store data for that doc_id
        if (!compiledData[doc_id]) {
            console.log();
            compiledData[doc_id] = [];
        }

    // Add the current row data to the array
    compiledData[doc_id].push({ trn_date, trn_status, doc_title, trn_id });
    });
    return compileFinalData(compiledData);
}

/**
 * The function compiles the data of sorted transactions in order to identify the req date, current statusn trn id or a specific document
 * The data will be used in order to display all the submissions of the requester
 * @param {*} compiledData sorted array of transactions
 * @returns final data array for the requester-home display
 */
function compileFinalData(compiledData){
    // Compile the final result
    const result = Object.entries(compiledData).map(([doc_id, dataArray]) => {
        // Sort the dataArray by trn_date
        dataArray.sort((a, b) => new Date(a.trn_date) - new Date(b.trn_date));
  
        let req_date = dataArray[0].trn_date;
        const current_status = dataArray[dataArray.length - 1].trn_status;
        const doc_title = dataArray[dataArray.length - 1].doc_title;
        const trn_id = dataArray[dataArray.length - 1].trn_id;
        req_date = formatRequestDate(req_date);
        
        return {
        doc_id,
        doc_title,
        req_date,
        current_status,
        trn_id
        };
    });

    return result;
}

/**
 * Formats a date ojbect to a MM-DD-YYYY format
 * @param {*} req_date 
 * @returns formatted date
 * author/s: Jav Ivan Ezra Paguyo
 */
function formatRequestDate(req_date){
    const date = new Date(req_date);

    const options = { month: 'short', day: '2-digit', year: 'numeric' };

    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);
    return formattedDate;
}

module.exports = router;