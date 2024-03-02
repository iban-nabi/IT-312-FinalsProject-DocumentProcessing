var heads = document.querySelectorAll('.th-color');
console.log(heads);
heads.forEach(function (head) {
    var text = head.textContent;
    console.log(text);
    if (text.includes("APPROVED")) {
        head.style.backgroundColor = "#BCFF88";
    }
    if (text.includes("RETURNED")) {
        head.style.backgroundColor = "#FF8888";
    }
    if (text.includes("REVIEWING")) {
        head.style.backgroundColor = "#FFCF88";
    }
    if (text.includes("RECEIVED")) {
        head.style.backgroundColor = "#F0E68C";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    createDocumentReview();



    /**
         * This function creates a form containing POST data to send to the document-review webpage.
         * It is hidden from view.
         */
    function createDocumentReview() {
        const reviewButton = document.querySelector('#view-button');
        const docID = document.querySelector('#docid').textContent;
        const version = document.querySelector('#version').textContent;
        const documentTitle = document.querySelector('#doctitle').textContent;
        const username = document.querySelector('#username').textContent;

        const type = document.querySelector('#doctype').textContent;
        const size = document.querySelector('#docsize').textContent;
        const pages = document.querySelector('#pagenum').textContent;
        const date = document.querySelector('#reqdate').textContent;

        reviewButton.addEventListener('click', () => {
            const filenamePDF = `${docID}-v${version}-${documentTitle}`;
            const deptName = `requester`;
            const docTitle = documentTitle;
            const docVersion = version;
            const requester = username;
            const docType = type;
            const docSize = size;
            const pageNum = pages;
            const reqDate = date;

            // Remove existing hidden inputs
            document.querySelectorAll('.hidden-inputs').forEach(element => element.remove());

            // Create hidden inputs dynamically
            const form = document.createElement('form');
            form.setAttribute('action', `/document-review/view`);
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
            hiddenPDF.type = 'hidden';
            hiddenDept.type = 'hidden';
            hiddenDoc.type = 'hidden';
            hiddenVer.type = 'hidden';
            hiddenReq.type = 'hidden';
            hiddenType.type = 'hidden';
            hiddenSize.type = 'hidden';
            hiddenNum.type = 'hidden';
            hiddenDate.type = 'hidden';
            hiddenPDF.name = 'filenamePDF';
            hiddenDept.name = 'deptName';
            hiddenDoc.name = 'docTitle';
            hiddenVer.name = 'docVersion';
            hiddenReq.name = 'requester';
            hiddenType.name = 'docType';
            hiddenSize.name = 'docSize';
            hiddenNum.name = 'pageNum';
            hiddenDate.name = 'reqDate';
            hiddenPDF.value = filenamePDF;
            hiddenDept.value = deptName;
            hiddenDoc.value = docTitle;
            hiddenVer.value = docVersion;
            hiddenReq.value = requester;
            hiddenType.value = docType;
            hiddenSize.value = docSize;
            hiddenNum.value = pageNum;
            hiddenDate.value = reqDate;
            hiddenPDF.classList.add('hidden-inputs');
            hiddenDept.classList.add('hidden-inputs');
            hiddenDoc.classList.add('hidden-inputs');
            hiddenVer.classList.add('hidden-inputs');
            hiddenReq.classList.add('hidden-inputs');
            hiddenType.classList.add('hidden-inputs');
            hiddenSize.classList.add('hidden-inputs');
            hiddenNum.classList.add('hidden-inputs');
            hiddenDate.classList.add('hidden-inputs');
            form.appendChild(hiddenPDF);
            form.appendChild(hiddenDept);
            form.appendChild(hiddenDoc);
            form.appendChild(hiddenVer);
            form.appendChild(hiddenReq);
            form.appendChild(hiddenType);
            form.appendChild(hiddenSize);
            form.appendChild(hiddenNum);
            form.appendChild(hiddenDate);
            reviewButton.setAttribute('type', 'submit');
            form.appendChild(reviewButton);
            document.body.appendChild(form);
            reviewButton.click();
        })
    };
});
