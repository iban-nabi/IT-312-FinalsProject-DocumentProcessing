/**
 * Contains various functions for the main home page of the reviewer web page.
 * Author/s: Carl Joshua Lalwet
 */
import { showAlert } from '/public/scripts/common/show-alert.js';

document.addEventListener('DOMContentLoaded', () => {

    document.querySelector('#show-help-button').addEventListener('click', () => {
        showAlert("Welcome to the Reviewer Page!", "Click on the three options at the top of the table to filter through your documents, and click on the column titles to sort them by ascending/descending order.");
    })

    const table = document.querySelector("#reviewer-table");
    const tableTitle = document.querySelector("#top-header");
    const data = table.innerHTML;

    notifs();

    createDocumentReview();

    logOut();

    tableSorting();

    tableFiltering();

    /**
     * Shows notifications via the showAlert function. Based on Pending transactions.
     * Author/s: Carl Joshua Lalwet
     */
    function notifs() {
        const docData = JSON.parse(document.querySelector("#doc-data").textContent);
        
        docData.forEach(doc => {
            if (doc.trn_status == "PENDING") {
                enableNotifs();
            }
        });

        document.querySelector('#notif').addEventListener('click', () => {
            let notifications = '<ul>';
            docData.forEach(doc => {
                if (doc.trn_status == "PENDING" && doc.version == 1) {
                    notifications += `
                    <li style = 'text-align: left; padding-left: 100px'>${new Date(doc.trn_date).toLocaleTimeString()} | Received <strong>new</strong> document <strong>"${doc.doc_title}"</strong> from <strong>${doc.acct_fname} ${doc.acct_lname}</strong></li>
                    `;
                }
                if (doc.trn_status == "PENDING" && doc.version > 1) {
                    notifications += `
                    <li style = 'text-align: left; padding-left: 100px'>${new Date(doc.trn_date).toLocaleTimeString()} | Received <strong>revised</strong> document <strong>"${doc.doc_title}"</strong> (version ${doc.version}) from <strong>${doc.acct_fname} ${doc.acct_lname}</strong></li>
                    `;
                }
            });
            notifications += `</ul>`

            if (!notifications.includes('<li')) {
                notifications = '<i>You have not received any new documents.</i>'
            }

            showAlert("Notifications", notifications, false, 800);
        })

        function enableNotifs() {
            document.getElementById('notificationBadge').textContent = '.';
            const styleElement = document.createElement('style');
            styleElement.textContent = `
                            .bg-notif {
                                position: relative;
                            }
                            .badge {
                                position: absolute;
                                top: 10px;
                                left: 3px;
                                background-color: red;
                                color: rgba(255, 255, 255, 0);
                                width: 10px;
                                height: 10px;
                                border-radius: 50%;
                                font-size: 1px;
                            }
                            `;

            document.head.appendChild(styleElement);
        }
    }
    /**
     * This function creates a form containing POST data to send to the document-review webpage.
     * It is hidden from view.
     */
    function createDocumentReview() {
        const reviewButtons = document.querySelectorAll('.review-button');

        reviewButtons.forEach(button => {
            button.addEventListener('click', () => {
                var title = "";
                var message = "";
                var view = "";
                var file = button.getAttribute(`data-doctitle`) + " (version " + button.getAttribute(`data-version`) + ")"
                if (button.textContent.endsWith("Start Review")) {
                    title = "Start Document Review?";
                    message = "Doing so will change this document's status to <strong>'Reviewing.'</strong> The requester will not be able to make changes to the document once you begin, and will have to wait for you to <strong>Return</strong> or <strong>Approve</strong> the document.<br><br>";
                }
                else if (button.textContent.includes("Continue")) {
                    title = "Continue Document Review?";
                    message = "";
                }
                else if (button.textContent.endsWith("View")) {
                    view = "/view"
                    title = "View Document?"
                    message = "";
                }
                showAlert(title, message + `<strong>` + file + "</strong>", true).then(result => {
                    //confirmed document review
                    if (result) {
                        const filenamePDF = button.dataset.filenamepdf;
                        const deptName = button.dataset.deptname;
                        const docTitle = button.dataset.doctitle;
                        const docVersion = button.dataset.version;
                        const requester = button.dataset.requester;
                        const docType = button.dataset.doctype;
                        const docSize = button.dataset.docsize;
                        const pageNum = button.dataset.pagenum;
                        const reqDate = button.dataset.reqdate;
                        const revofcid = button.dataset.revofcid;
                        const trnid = button.dataset.trnid;

                        // Remove existing hidden inputs
                        document.querySelectorAll('.hidden-inputs').forEach(element => element.remove());

                        // Create hidden inputs dynamically
                        const form = document.createElement('form');
                        form.setAttribute('action', `/document-review${view}`);
                        form.setAttribute('method', 'POST');
                        const hiddenPDF = document.createElement('input')
                        const hiddenDept = document.createElement('input');
                        const hiddenDoc = document.createElement('input');
                        const hiddenVer = document.createElement('input');
                        const hiddenReq = document.createElement('input');
                        const hiddenType = document.createElement('input');
                        const hiddenSize = document.createElement('input');
                        const hiddenNum = document.createElement('input');
                        const hiddenDate = document.createElement('input');
                        const hiddenRevofc = document.createElement('input');
                        const hiddenTrnid = document.createElement('input');
                        hiddenPDF.type = 'hidden';
                        hiddenDept.type = 'hidden';
                        hiddenDoc.type = 'hidden';
                        hiddenVer.type = 'hidden';
                        hiddenReq.type = 'hidden';
                        hiddenType.type = 'hidden';
                        hiddenSize.type = 'hidden';
                        hiddenNum.type = 'hidden';
                        hiddenDate.type = 'hidden';
                        hiddenRevofc.type = 'hidden';
                        hiddenTrnid.type = 'hidden';
                        hiddenPDF.name = 'filenamePDF';
                        hiddenDept.name = 'deptName';
                        hiddenDoc.name = 'docTitle';
                        hiddenVer.name = 'docVersion';
                        hiddenReq.name = 'requester';
                        hiddenType.name = 'docType';
                        hiddenSize.name = 'docSize';
                        hiddenNum.name = 'pageNum';
                        hiddenDate.name = 'reqDate';
                        hiddenRevofc.name = 'revofcid';
                        hiddenTrnid.name = 'trnid';
                        hiddenPDF.value = filenamePDF;
                        hiddenDept.value = deptName;
                        hiddenDoc.value = docTitle;
                        hiddenVer.value = docVersion;
                        hiddenReq.value = requester;
                        hiddenType.value = docType;
                        hiddenSize.value = docSize;
                        hiddenNum.value = pageNum;
                        hiddenDate.value = reqDate;
                        hiddenRevofc.value = revofcid;
                        hiddenTrnid.value = trnid;
                        hiddenPDF.classList.add('hidden-inputs');
                        hiddenDept.classList.add('hidden-inputs');
                        hiddenDoc.classList.add('hidden-inputs');
                        hiddenVer.classList.add('hidden-inputs');
                        hiddenReq.classList.add('hidden-inputs');
                        hiddenType.classList.add('hidden-inputs');
                        hiddenSize.classList.add('hidden-inputs');
                        hiddenNum.classList.add('hidden-inputs');
                        hiddenDate.classList.add('hidden-inputs');
                        hiddenRevofc.classList.add('hidden-inputs');
                        hiddenTrnid.classList.add('hidden-inputs');
                        form.appendChild(hiddenPDF);
                        form.appendChild(hiddenDept);
                        form.appendChild(hiddenDoc);
                        form.appendChild(hiddenVer);
                        form.appendChild(hiddenReq);
                        form.appendChild(hiddenType);
                        form.appendChild(hiddenSize);
                        form.appendChild(hiddenNum);
                        form.appendChild(hiddenDate);
                        form.appendChild(hiddenRevofc);
                        form.appendChild(hiddenTrnid);
                        button.setAttribute('type', 'submit');
                        form.appendChild(button);
                        document.body.appendChild(form);
                        button.click();
                    }
                })
            });
        });
    };

    /**
     * Adds log out functionality to exit the sytem and end the session.
     */
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

    /**
     * Enables sorting of documents via clicking their column headers.
     */
    function tableSorting() {
        const headerCells = document.querySelectorAll("#column-titles th");
        const titleText = tableTitle.textContent;

        //sorting algorithm
        const sortTableByColumn = (cellTitle, columnIndex, order) => {
            const tableBody = document.querySelector("#reviewer-table tbody");
            const rows = Array.from(tableBody.querySelectorAll('tr'));

            console.log(rows[0])

            rows.sort((a, b) => {
                const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
                const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();
                if (order == "asc") {
                    console.log("asc")
                    tableTitle.innerHTML = '';
                    tableTitle.innerHTML = titleText + `<br> Sorted by ${cellTitle} Ascending Order`;
                    return cellA.localeCompare(cellB);
                } else if (order == "desc") {
                    console.log("desc")
                    tableTitle.innerHTML = '';
                    tableTitle.innerHTML = titleText + `<br> Sorted by ${cellTitle} Descending Order`;
                    return cellB.localeCompare(cellA);
                }
            });

            tableBody.innerHTML = '';
            rows.forEach(row => tableBody.appendChild(row));
        };

        //make column headers clickable
        headerCells.forEach((cell, index) => {
            if (index < headerCells.length - 1) {
                const currText = cell.textContent;
                cell.addEventListener("click", () => {
                    const currIndex = index;

                    if (cell.textContent.includes("▲")) {
                        sortTableByColumn(currText, index, "desc");
                        cell.innerHTML = '';
                        cell.textContent = currText + " ▼";
                    } else if (cell.textContent.includes("▼")) {
                        sortTableByColumn(currText, index, "asc");
                        cell.innerHTML = '';
                        cell.textContent = currText + " ▲";
                    } else {
                        sortTableByColumn(currText, index, "desc");
                        cell.innerHTML = '';
                        cell.textContent = currText + " ▼";
                    }

                    headerCells.forEach((cell, index) => {
                        if (index != currIndex) {
                            if (index != currIndex && cell.textContent.includes("▲") || cell.textContent.includes("▼")) {
                                // Slice the last 2 characters if '▲' or '▼' is present
                                let newText = cell.textContent.slice(0, -2);
                                cell.textContent = newText;
                            }
                        }
                    });
                });
            }
        });
    }
    function resetTable() {
        table.innerHTML = '';
        table.innerHTML = data;
    }

    /**
     * Enables filtering of documents via the 3 buttons at the top of the page.
     */
    function tableFiltering() {
        const pendingBtn = document.querySelector(`#pending-btn`);
        const returnedBtn = document.querySelector(`#returned-btn`);
        const approvedBtn = document.querySelector(`#approved-btn`);

        pendingBtn.addEventListener('click', () => {
            filter(pendingBtn, "PENDING");
        })
        approvedBtn.addEventListener('click', () => {
            filter(approvedBtn, "APPROVED");
        })
        returnedBtn.addEventListener('click', () => {
            filter(returnedBtn, "RETURNED");

        })

        pendingBtn.click();

        function filter(button, status) {
            resetTable();
            tableTitle.innerHTML = '';
            const filterBtns = Array.from(document.querySelector(`#filter-buttons`).querySelectorAll('button'));
            filterBtns.forEach(btn => {
                btn.disabled = false;
            })
            button.disabled = true;

            const tableBody = document.querySelector("#reviewer-table tbody");
            const rows = Array.from(tableBody.querySelectorAll('tr'));
            rows.forEach(row => {
                const statusCell = row.querySelectorAll('td')[6];
                var condition = statusCell.textContent !== status;
                if (status == "PENDING") {
                    condition = statusCell.textContent !== status && statusCell.textContent !== "REVIEWING";
                }
                if (condition) {
                    row.remove();
                }
            });
            createDocumentReview();
            tableSorting();
        }
    }

});



