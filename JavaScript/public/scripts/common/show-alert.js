/**
 * Displays an alert message to use in place of the default alert() function. 
 * Its style can be customized through the CSS already within the JavaScript.
 * 
 * Import it into yout PUG file using:
 * 
 *      script(type="module" src="/public/scripts/common/show-alert.js")
 *      script(type="module" src='directory-of-file-that-will-import-showAlert.js')
 * 
 * Then import it into your JavaScript file using:
 * 
 *      import { showAlert } from './show-alert.js';
 * 
 * Then use showAlert() like normal.
 * Author/s: Carl Joshua Lalwet
 * @param {string} title - The title above the message, in bold font.
 * @param {string} message - The message to be displayed in the alert.
 * @param {boolean} hasCancel - if true: a cancel button will be included. Allows the use of showAlert().then(result => {//handling of result=true or false))
 * @param {int} customWidth - Specify a custom width. Entered integer will be expressed in px.
 * @returns {Promise} - A Promise that resolves when the modal is closed.
 */
function showAlert(title, message, hasCancel, customWidth) {
    return new Promise(function (resolve) {
        // Create the overlay element
        const overlay = document.createElement('div');
        overlay.id = 'show-alert-overlay';
        overlay.classList.add('show-alert-overlay');

        // Create the modal element
        const modal = document.createElement('div');
        modal.classList.add('show-alert-modal');

        // Create the title element
        const alertTitle = document.createElement('strong');
        alertTitle.id = 'show-alert-title-message';
        alertTitle.classList.add('show-alert-title-message');
        alertTitle.innerHTML = title;

        // Create the message element
        const alertMessage = document.createElement('span');
        alertMessage.id = 'show-alert-body-message';
        alertMessage.classList.add('show-alert-body-message');
        if (message != ""){
            alertMessage.innerHTML = `<br><hr> ${message} <br><br>`; //message exists
        }else{
            alertMessage.innerHTML = `<hr>`; //only line will be shown
        }

        // Create the div element for buttons
        const btnDiv = document.createElement('div');
        btnDiv.id = 'show-alert-button-div';
        btnDiv.classList.add('show-alert-button-div');

        // Create the confirm and cancel buttons
        const confirmBtn = document.createElement('button');
        confirmBtn.id = 'show-alert-confirm-button';
        confirmBtn.classList.add('show-alert-confirm-button','btn','btn-primary');
        confirmBtn.textContent = 'Confirm';
        confirmBtn.style.margin = '5px';
        btnDiv.appendChild(confirmBtn);

        if (hasCancel) {
            const cancelBtn = document.createElement('button');
            cancelBtn.id = 'show-alert-cancel-button';
            cancelBtn.classList.add('show-alert-cancel-button','btn','btn-secondary');
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.margin = '5px';
            btnDiv.appendChild(cancelBtn);

            // Close the modal overlay on button click
            cancelBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(false); // Resolve the promise when the modal is closed
        });
        }

        // Create the div element
        const alertDiv = document.createElement('div');
        alertDiv.id = 'show-alert-alert-div';
        alertDiv.classList.add('show-alert-alert-div');
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
            max-width: 300px;
            max-height: 600px;
            overflow: auto;
        `;


        // Apply styles to respective elements
        overlay.setAttribute('style', overlayStyles);
        alertDiv.setAttribute('style', modalStyles);
        if (customWidth) {
            alertDiv.style.minWidth = `${customWidth}px`
        }

        // Close the modal overlay on button click
        confirmBtn.addEventListener('click', () => {
            document.body.removeChild(overlay);
            resolve(true); // Resolve the promise when the modal is closed
        });


        // Show the overlay and modal dialog
        overlay.style.display = 'block';
    });
}
export { showAlert };