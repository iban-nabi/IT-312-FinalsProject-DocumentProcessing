/**
 * This script is the implementation of the PDFTron API and the WebViewer SDK. 
 * Can be used by both Requesters and Reviewers, allowing viewing and annotation, 
 * respectively.
 * Author/s: Carl Joshua Lalwet
 */
import { showAlert } from './show-alert.js';

var viewerElement = document.getElementById('viewer');

var filename_pdf = document.querySelector(`#filename-pdf`).textContent;
var requester = document.querySelector(`#requester`).textContent;
var title = document.querySelector('#pdfname').textContent;
var version = document.querySelector('#version').textContent;
var doctype = document.querySelector('#doctype').textContent;
var docsize = document.querySelector('#docsize').textContent;
var pagenum = document.querySelector('#pagenum').textContent;
var reqdate = document.querySelector('#reqdate').textContent;
var revofcid = document.querySelector('#revofcid').textContent;
var user = document.querySelector(`#user`).textContent;
var remarks = document.querySelector('#remarks').textContent;

var home = '/requester-home';
var viewer = false;

if (user.endsWith('-viewer')) {
    viewer = true;
    user = user.replace('-viewer', '');
}

if (user != "requester") {
    home = '/reviewer-home'
}

WebViewer({
    path: '/public/lib',
    initialDoc: `/pdf/${requester}/${title}/${version}/${user}`,
    disabledElements: [
        'noteState',
        'leftPanelButton',
        'panToolButton',
        'textSelectButton',
        'viewControlsButton'
    ],
    fullAPI: true,
}, viewerElement).then(instance => {
    const { documentViewer, annotationManager } = instance.Core;
    const document = instance.UI.iframeWindow.document;

    instance.UI.disableElements(['reply-area-container']);
    instance.UI.disableReplyForAnnotations((annot) => true)

    commonActions();

    if (user == 'requester' || viewer == true) {
        requesterActions();
    } else {
        reviewerActions();
    }

    /**
     * A requester will only be able to view the PDF.
     */
    function requesterActions() {
        instance.UI.openElements(['notesPanel']);
        instance.UI.disableElements([
            'ribbons',
            'contextMenuPopup']);
        instance.UI.setToolbarGroup('toolbarGroup-View');
    }

    /**
     * A reviewer will only be able to annotate the PDF.
     * Added: Return Button, Approve Button
     */
    function reviewerActions() {
        showAlert(
            "You are now reviewing the submitted document.",
            "Click on <strong>Approve</strong> if the document does not need revisions. Otherwise, add necessary comments and click on <strong>Return</strong> to allow the requester to revise the document.")
            .then(() => {
                if (remarks != '') {
                    showAlert("", remarks)
                }
            });


        annotationManager.setCurrentUser(user);
        instance.UI.openElements(['notesPanel']);
        instance.UI.disableElements(['ribbons']);
        instance.UI.setToolbarGroup('toolbarGroup-Annotate');

        // Add custom reviewer elements
        instance.UI.setHeaderItems(header => {
            header.push({
                type: 'divider'
            },
                {
                    type: 'customElement',
                    render: () => {
                        const returnBtn = document.createElement('button');
                        returnBtn.textContent = 'Return';
                        returnBtn.style.paddingLeft = '10px';
                        returnBtn.style.paddingRight = '10px';
                        returnBtn.style.paddingTop = '7px';
                        returnBtn.style.paddingBottom = '7px';
                        returnBtn.style.marginLeft = '5px';
                        returnBtn.style.marginRight = '5px';
                        returnBtn.style.backgroundColor = '#a72f24';
                        returnBtn.style.color = 'white';
                        returnBtn.style.borderRadius = '8px';
                        returnBtn.style.borderWidth = '0px';
                        returnBtn.style.cursor = 'pointer';


                        returnBtn.onclick = () => {
                            const noAnnotationsDiv = document.querySelector('.no-annotations');
                            if (noAnnotationsDiv !== null) {
                                showAlert(
                                    "You cannot return a document when no annotations are present!",
                                    "Either click on <strong>Approve</strong> to conclude the document review, or add necessary annotations before clicking on <strong>Return.</strong>");
                            } else {
                                showAlert(
                                    "Return this document with your annotations?",
                                    "The document, along with your annotations, will be returned to the requester for revisions.",
                                    true
                                ).then(result => {
                                    if (result) {
                                        annotateDocument(annotationManager, documentViewer, "return");
                                    }
                                })
                            }
                        };

                        return returnBtn;
                    }
                },
                {
                    type: 'customElement',
                    render: () => {
                        const approveBtn = document.createElement('button');
                        approveBtn.textContent = 'Approve';
                        approveBtn.style.paddingLeft = '10px';
                        approveBtn.style.paddingRight = '10px';
                        approveBtn.style.paddingTop = '7px';
                        approveBtn.style.paddingBottom = '7px';
                        approveBtn.style.marginLeft = '5px';
                        approveBtn.style.marginRight = '5px';
                        approveBtn.style.backgroundColor = '#297937';
                        approveBtn.style.color = 'white';
                        approveBtn.style.borderRadius = '8px';
                        approveBtn.style.borderWidth = '0px';
                        approveBtn.style.cursor = 'pointer';


                        approveBtn.onclick = () => {
                            const noAnnotationsDiv = document.querySelector('.no-annotations');
                            if (noAnnotationsDiv !== null) {
                                if (user != "OVP for Administration") {
                                    enterRemarks();
                                } else {
                                    showAlert("Approve Document?", "This will conclude the document review. The document will be marked as fully approved after this!", true)
                                        .then(result => {
                                            if (result) {
                                                const requestData = {
                                                    requester: requester,
                                                    title: title,
                                                    version: version,
                                                    reviewer: revofcid
                                                };
                                                fetch(`/document-review/approve`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json'
                                                    },
                                                    body: JSON.stringify(requestData)
                                                }).then(function (res) {
                                                    if (res.status === 200) {
                                                        showAlert("Document Approved!", "You will now be returned to the home page.").then(() => {
                                                            window.location.href = home;

                                                        })
                                                    } else if (res.status === 500) {
                                                        showAlert("Error saving Document Details.", "Please try again.")
                                                    }
                                                });

                                            }
                                        });
                                }
                            } else {
                                showAlert(
                                    "You cannot approve a document when annotations are present!",
                                    "Either click on <strong>Return</strong> to send the document for revisions, or remove your annotations before clicking on <strong>Approve.</strong>");
                            }
                        };

                        return approveBtn;
                    }
                });
        });
    }

    /**
     * Adds custom elements common to all users.
     * Added: Exit Button, Document Title
     */
    function commonActions() {
        instance.UI.setHeaderItems(header => {
            header.delete(9);
            header.unshift({
                //Exit Button
                type: 'customElement',
                render: () => {
                    const exitBtn = document.createElement('button');
                    exitBtn.textContent = 'Exit Document Review';
                    exitBtn.style.paddingLeft = '10px';
                    exitBtn.style.paddingRight = '10px';
                    exitBtn.style.paddingTop = '7px';
                    exitBtn.style.paddingBottom = '7px';
                    exitBtn.style.marginLeft = '5px';
                    exitBtn.style.marginRight = '5px';
                    exitBtn.style.backgroundColor = '#4085cb';
                    exitBtn.style.color = 'white';
                    exitBtn.style.borderRadius = '8px';
                    exitBtn.style.borderWidth = '0px';
                    exitBtn.style.cursor = 'pointer';

                    exitBtn.onclick = () => {
                        if (user != "requester" && viewer == false) {
                            showAlert("Exit Document Review?", "Your annotations will be saved.", true)
                                .then(result => {
                                    if (result) {
                                        annotateDocument(annotationManager, documentViewer, "reviewing");
                                    }
                                });
                        } else {
                            showAlert("Return to home page?", "", true)
                                .then(result => {
                                    if (result) {
                                        window.location.href = home;
                                    }
                                })
                        }
                    };
                    return exitBtn;
                }
            }, {
                type: 'divider'
            }, {
                //Details Button
                type: 'customElement',
                render: () => {
                    const detailsBtn = document.createElement('button');
                    detailsBtn.textContent = 'View Document Details';
                    detailsBtn.style.paddingLeft = '10px';
                    detailsBtn.style.paddingRight = '10px';
                    detailsBtn.style.paddingTop = '7px';
                    detailsBtn.style.paddingBottom = '7px';
                    detailsBtn.style.marginLeft = '5px';
                    detailsBtn.style.marginRight = '5px';
                    detailsBtn.style.backgroundColor = '#4085cb';
                    detailsBtn.style.color = 'white';
                    detailsBtn.style.borderRadius = '8px';
                    detailsBtn.style.borderWidth = '0px';
                    detailsBtn.style.cursor = 'pointer';


                    detailsBtn.onclick = () => {
                        let detailsMessage = `
                        <li style = 'text-align: left;'>Title: ${title}</li>
                        <li style = 'text-align: left;'>Version: ${version}</li>
                        <li style = 'text-align: left;'>File Type: ${doctype}</li>
                        <li style = 'text-align: left;'>File Size: ${docsize}</li>
                        <li style = 'text-align: left;'>No. of Pages: ${pagenum}</li>
                        <li style = 'text-align: left;'>Requester: ${requester}</li>
                        <li style = 'text-align: left;'>Requester Date: ${reqdate}</li>
                        `;



                        showAlert('Document Details', detailsMessage);
                    };
                    return detailsBtn;
                }
            }, {
                type: 'divider'
            });
        });
    }
});

//fixes viewport rendering issues
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector('#notif').style.display = 'none';
    document.querySelector(".logout").addEventListener("click", () => {
        showAlert("Log Out?", "", true).then(result => {
            if (result) {
                window.location.href = "/logout";
            }
        });

    });


    const viewerElement = document.getElementById('viewer');
    // Set #viewer width and height to occupy maximum browser window
    function setViewerDimensions() {
        viewerElement.style.width = window.innerWidth - '50px';
        viewerElement.style.height = window.innerHeight + 'px';

    }
    handleOrientationChange();
    function handleOrientationChange() {
        if (window.matchMedia("(orientation: portrait)").matches && window.innerWidth <= window.innerHeight) {
            let active = true;
            showAlert("Our document viewer works best when viewed in landscape mode.", "Please rotate your phone to continue.", true).then((result) => {
                if (result) {
                    active = false;
                } else {
                    window.location.href = home;
                }
            });

            setInterval(function () {
                if (window.matchMedia("(orientation: portrait)").matches && window.innerWidth <= window.innerHeight && active == false) {
                    active = true;
                    showAlert("Our document viewer works best when viewed in landscape mode.", "Please rotate your phone to continue.", true).then((result) => {
                        if (result) {
                            active = false;
                        } else {
                            window.location.href = home;
                        }
                    });
                }
            }, 1000);
        }
    }

    // Initially set dimensions and also update on window resize
    setViewerDimensions();
    window.addEventListener('resize', setViewerDimensions);
    window.addEventListener("orientationchange", handleOrientationChange);
});

function enterRemarks() {
    // Create the overlay element
    const overlay = document.createElement('div');
    overlay.id = 'enter-remarks-overlay';
    overlay.classList.add('enter-remarks-overlay');

    // Create the modal element
    const modal = document.createElement('div');
    modal.classList.add('enter-remarks-modal');

    // Create the title element
    const alertTitle = document.createElement('strong');
    alertTitle.id = 'enter-remarks-title-message';
    alertTitle.classList.add('enter-remarks-title-message');
    alertTitle.textContent = "To Approve this document, please provide remarks that will be received by the next department that will review this document.";


    // Create the message element
    const alertMessage = document.createElement('textarea');
    alertMessage.id = 'enter-remarks-body-message';
    alertMessage.classList.add('enter-remarks-body-message');
    alertMessage.style.width = '100%';
    alertMessage.placeholder = 'Please enter your remarks here...'

    // Create the div element for buttons
    const btnDiv = document.createElement('div');
    btnDiv.id = 'enter-remarks-button-div';
    btnDiv.classList.add('enter-remarks-button-div');

    // Create the confirm and cancel buttons
    const confirmBtn = document.createElement('button');
    confirmBtn.id = 'enter-remarks-confirm-button';
    confirmBtn.classList.add('enter-remarks-confirm-button', 'btn', 'btn-primary');
    confirmBtn.textContent = 'Confirm';
    confirmBtn.style.margin = '5px';
    btnDiv.appendChild(confirmBtn);

    const cancelBtn = document.createElement('button');
    cancelBtn.id = 'enter-remarks-cancel-button';
    cancelBtn.classList.add('enter-remarks-cancel-button', 'btn', 'btn-secondary');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.margin = '5px';
    btnDiv.appendChild(cancelBtn);

    btnDiv.appendChild(document.createElement('br'));

    const errorMessage = document.createElement('span');
    errorMessage.style.color = 'red';
    errorMessage.textContent = "Please add your remarks!";
    errorMessage.style.display = 'none';
    btnDiv.appendChild(errorMessage);

    // Close the modal overlay on button click
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(overlay);
        resolve(false); // Resolve the promise when the modal is closed
    });


    // Create the div element
    const alertDiv = document.createElement('div');
    alertDiv.id = 'enter-remarks-alert-div';
    alertDiv.classList.add('enter-remarks-alert-div');
    alertDiv.appendChild(alertTitle);
    alertDiv.appendChild(alertMessage);
    alertDiv.appendChild(btnDiv);
    modal.appendChild(alertDiv);

    // Append modal to overlay
    overlay.appendChild(modal);

    // Append overlay to body
    document.body.appendChild(overlay);

    // Styles for the modal overlay
    const overlayStyles = `
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        `;

    // Styles for the modal dialog
    const modalStyles = `
            font-family: 'Calibri', sans-serif;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            text-align: center;
            border-radius: 5px;
            max-width: 500px;
            max-height: 600px;
            overflow: auto;
        `;


    // Apply styles to respective elements
    overlay.setAttribute('style', overlayStyles);
    alertDiv.setAttribute('style', modalStyles);

    // Close the modal overlay on button click
    confirmBtn.addEventListener('click', () => {
        if (alertMessage.value.trim() !== '') {
            errorMessage.style.display = 'none';
            showAlert("Approve Document?", "This will conclude the document review. The document will proceed with the next step in the approval process and you will not be able to annotate this document afterwards.", true)
                .then(result => {
                    if (result) {
                        document.body.removeChild(overlay);
                        const remarks = "Remarks from " + user + ": " + alertMessage.value;
                        const requestData = {
                            requester: requester,
                            title: title,
                            version: version,
                            reviewer: revofcid,
                            remarks: remarks
                        };
                        fetch(`/document-review/approve`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(requestData)
                        }).then(function (res) {
                            if (res.status === 200) {
                                showAlert("Document Approved!", "You will now be returned to the home page.").then(() => {
                                    window.location.href = home;

                                })
                            } else if (res.status === 500) {
                                showAlert("Error saving Document Details.", "Please try again.")
                            }
                        });

                    }
                });
        } else {
            errorMessage.style.display = 'inline';
        }
    });


    // Show the overlay and modal dialog
    overlay.style.display = 'block';
}

/**
 * Annotates the document and changes status.
 * @param status - REVIEWING, APPROVED, RETURNED. statuses to be applied.
 */
function annotateDocument(annotationManager, documentViewer, status) {
    ((filename) => new Promise((resolve) => {
        console.log(status)
        annotationManager.exportAnnotations().then((xfdfString) => {
            documentViewer.getDocument().getFileData({ xfdfString }).then(function (data) {
                var arr = new Uint8Array(data);
                var blob = new Blob([arr], { type: 'application/pdf' });
                // FormData is used to send blob data through fetch
                var formData = new FormData();
                formData.append('blob', blob);
                fetch(`/annotation-handler.js?requester=${requester}&filename=${filename}&version=${version}`, {
                    method: 'POST',
                    body: formData
                }).then((res) => {
                    if (res.status === 200) { resolve(); }
                    else if (res.status === 500) {
                        showAlert("Error fetching Document Details.", "Please try again.");
                    }
                });
            });
        });
    }))(`${filename_pdf}.pdf`).then(() => {
        const requestData = {
            requester: requester,
            title: title,
            version: version,
            reviewer: revofcid
        };
        fetch(`/document-review/${status}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        }).then(function (res) {
            if (res.status === 200) {
                if (status == "returned") {
                    showAlert("Document has been successfully annotated.",
                        "The document will now be returned to the requester.").then(
                            () => {
                                window.location.href = home;
                            });
                }
                else {
                    showAlert("Annotations have been saved.",
                        "").then(
                            () => {
                                window.location.href = home;
                            });
                }

            } else if (res.status === 500) {
                showAlert("Error saving Document Details.", "Please try again.");
            }
        });

    });
}


// How to use the API to view documents:

// I used this to send a POST request.
//     form(action = '/document-review' method = 'POST')
//         button(type = 'submit',vonclick=`setHiddenInputs("${userData[0].dept_name}", "${item.doc_title}")`)

// In your router that will render the pug file, receive the POST request.
// e.g.
//     router.post('/', (req, res) => {
//         const user = decodeURIComponent(req.body.deptName);
//         const pdfName = decodeURIComponent(req.body.docTitle);
//         // Check received data in server console
//         res.render("reviewer/doc-review.pug", { user, pdfName });
//     });

// Then, link this JavaScript file to your views pug file that will render the document review.
// use this: script(src='/public/scripts/common/doc-review.js')
// for example doc-review.pug:

//     html
//     head
//     body
//         span#pdfname #{pdfName}
//         span#user #{user}
//         div#viewer

// Store the name of your PDF inside #pdfname.
// Store the user inside #user. This will be used for requester/reviewer credentials.
// The #viewer div is where the API will render.

// Also, the API does a FETCH request to retrieve the PDF file. Handle it in your route JavaScript
// e.g.
//     // Handle POST request sent to '/annotationHandler.js'
//     router.post('/', upload.any(), (req, res) => {
//     const filename = req.query.filename;
//     try {
//         // Write the blob into a PDF file
//         res.status(200).send(fs.writeFileSync(`/uploads/${decodeURIComponent(req.query.filename)}`, req.files[0].buffer));
//     } catch(e) {
//         res.status(500).send(`Error writing file data to ${filename}`);
//     }
//     res.end();
//     });

