const express = require('express');
const dbservice = require("../../database_service/requester_queries");
const router = express.Router();

const db = dbservice.getRequesterService();

/**
 * Create a route that will send a json to be used by the notification functionality of the requester side
 * author/s: Jan Ivan Ezra Paguyo
 */
router.get('/', (req,res)=>{
    const notif = db.getUserNotifictation(req.session.user.username);
    notif.then(data=>{
        for (const dataNotif of data) {
            if(dataNotif.notification === 0){
                console.log("trn id : "+dataNotif.trn_id);
                db.updateNotification(dataNotif.trn_id);
            }
        }
        res.json({data:data});
    });
});

router.get('/count-requester', (req,res)=>{
    const count = db.identifyNotif(req.session.user.username);
    count.then(data=>{
        res.json({data:data});
    });
});



module.exports = router;