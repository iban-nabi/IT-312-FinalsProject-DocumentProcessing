import { showAlert } from '/public/scripts/common/show-alert.js';

document.addEventListener('DOMContentLoaded', () => {

    fetch('/notification/count-requester')
        .then(res => res.json())
        .then(data => {
            data = Object.values(data);

            data.forEach(temp => {
                temp.forEach(info=>{
                    if(info!==""){
                        const styleElement = document.createElement('style');
                        styleElement.textContent = `
                            .bg-notif {
                                position: relative;
                            }
                            .badge {
                                position: absolute;
                                top: 10px;
                                left: 33px;
                                background-color: red;
                                color: rgba(255, 255, 255, 0);
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                font-size: 1px;
                            }
                            `;
                    
                        document.head.appendChild(styleElement);
                        
                        function updateNotificationBadge() {
                            const badgeElement = document.getElementById('notificationBadge');
                            badgeElement.textContent = '.';
                        }
                        updateNotificationBadge();
                    }
                })
            })
        })
        .catch(err => {
            console.error(err);
        });


    notifs();
    
    logOut();
    
    function notifs() {
        document.querySelector('#notif').addEventListener('click', () => {
            fetch('/notification')
                .then(res => res.json())
                .then(data => {
                    var notifications = '<ul style="list-style: none; padding: 0;">';
                    data = Object.values(data);
                    var limit = 7;
                    data.forEach(temp => {
                        
                        if (temp.length < 7){
                            limit = temp.length;
                        }

                        for (let i = 0; i < limit; i++) {
                            const info = temp[i];
                            console.log(JSON.stringify(info));
                            let date;

                            if(info.notification===0){
                                date = `[NEW] ${new Date(info.trn_date).toLocaleString()}`;
                            }else{
                                date = new Date(info.trn_date).toLocaleString();
                            }

                            let listItemStyle = 'text-align: left; padding-left: 100px; margin-bottom: 10px; padding-right: 10px;';
                            if (date.includes('[NEW]')) {
                                listItemStyle += 'background-color: #f0f0f0;';
                            }

                            if (info.trn_status == "REVIEWING") {
                                notifications += `
                                <li style='${listItemStyle}'>
                                    <strong>${date}</strong> | 
                                    Document <strong>"${info.doc_title}"</strong>
                                    is currently being reviewed by the
                                    <strong>${info.dept_name}</strong> department.
                                </li>`;
                            }
                    
                            if (info.trn_status == "RETURNED") {
                                notifications += `
                                <li style='${listItemStyle}'>
                                    <strong>${date}</strong> | 
                                    Your document <strong>"${info.doc_title}"</strong>
                                    has been returned by the
                                    <strong>${info.dept_name}</strong> department
                                    . Please resubmit a new document if you have not.
                                </li>`;
                            }
                    
                            if (info.trn_status == "APPROVED" && info.dept_name !== "OVP for Administration") {
                                notifications += `
                                <li style='${listItemStyle}'>
                                    <strong>${date}</strong> | 
                                    Document <strong>"${info.doc_title}"</strong>
                                    has been approved by the
                                    <strong>${info.dept_name}</strong> department
                                    . It would be then reviewed by the next department.
                                </li>`;
                            }
                    
                            if (info.trn_status == "APPROVED" && info.dept_name == "OVP for Administration") {
                                notifications += `
                                <li style='${listItemStyle}'>
                                    <strong>${date}</strong> | 
                                    Document <strong>"${info.doc_title}"</strong>
                                    has been approved by
                                    <strong>${info.dept_name}</strong>
                                    . Congratulations, you can now submit a new document to be reviewed.
                                </li>`;
                            }
                        }
                    });

                    notifications += `</ul>`
                    if (!notifications.includes('<li')) {
                        notifications = '<i>No notifications.</i>'
                    }

                    showAlert("Notifications", notifications, false, 800).then(result => {
                        const badgeElement = document.getElementById('notificationBadge');
                        notifications = "";
                        badgeElement.textContent = '';
                    });
                })
                .catch(err => {
                    console.error(err);
                });
        })  
    }

    function logOut() {
        document.querySelector(".logout").style.cursor = 'pointer';
        document.querySelector(".logout").addEventListener("click", () => {
            showAlert("Log Out?", "", true).then(result => {
                if (result) {
                    window.location.href = "/logout";
                }
            });

        });
    }
})