class SpecialLoginHeader extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
      </nav>
        `
    }
}


class SpecialReviewerHeader extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" onclick= window.location.href="/reviewer-home"><b class="bi bi-file-earmark-text-fill ps-4 clrwhite">&nbsp;Document Review System</b></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="bg-notif mt-1" id="notification">
                <a id="notif" class="nav-link ps-5" href="#"><b class="bi bi-bell">&nbsp;Notifications</b><span id="notificationBadge" class="badge"></span></a>       
            </li>
          </ul>
          <span class="bg-logout navbar-text">
            <a class="logout"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
        </span>
        </div>
      </nav>
        `
    }
}

class SpecialRequesterHeader extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" onclick= window.location.href="/requester-home"><b class="bi bi-file-earmark-text-fill ps-4 text-white">&nbsp;Document Review System</b></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="bg-notif mt-1">
                <a id="notif" class="nav-link ps-5" href="#"><b class="bi bi-bell">&nbsp;Notifications</b><span id="notificationBadge" class="badge"></span></a>       
            </li>
          </ul>
          <span class="bg-logout navbar-text">
            <a class="logout"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
        </span>
        </div>
      </nav>
        `
    }
}

class SpecialHeader extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark mb-4">
        <a class="navbar-brand" href="#"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
          </ul>
          <span class="bg-logout navbar-text">
            <a class="logout" onclick="window.location.href = '/logout';"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
        </span>
        </div>
      </nav>
        `
    }
}

class SpecialHeaderAdmin extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="../../../../Frontend/Admin/dashboard.php"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
            <li class="bg-archive mt-2">
                <a class="nav-link " href="./databeasts-final/Frontend/Admin/archive-accounts.html">Archive Accounts</a>
            </li>
            <li class="bg-user mt-2">
                <a class="nav-link" href="#">User Management</a>
            </li>
            <li class="bg-logs mt-2">
                <a class="nav-link" href="#">View Logs</a>
            </li>
          </ul>
          <span class="bg-logout navbar-text">
            <a class="logout" href ="../../../../PHP/logout.php"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
        </span>
        </div>
      </nav>
        `
    }
}

class SpecialFooter extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <!-- Footer -->
        <div id="databeast-footer" class="card-footer text-center text-white  p-2">
            <p>
                DataBeasts - 9488AB - IT312/312L - 1st Semester AY 2023 - 2024<br>
                IT Department<br>
                School of Accountancy, Management, Computing and Information Studies<br>
                Saint Louis University
            </p>
        </div>
        <!-- Footer -->
        `
    }
}

customElements.define('special-login-header', SpecialLoginHeader)
customElements.define('special-header-admin', SpecialHeaderAdmin)
customElements.define('special-reviewer-header', SpecialReviewerHeader)
customElements.define('special-requester-header', SpecialRequesterHeader)
customElements.define('special-header', SpecialHeader)
customElements.define('special-footer', SpecialFooter)

document.addEventListener('DOMContentLoaded', function() {
    // Get references to the relevant elements
    const accountTypeSelect = document.getElementById('accountType');
    const schoolTypeSection = document.getElementById('schoolTypeSection');
    const departmentTypeSection = document.getElementById('departmentTypeSection');

    // Function to update the form fields based on the selected account type
    function updateFormFields(qualifiedName, value) {
        // Hide all sections initially
        schoolTypeSection.style.display = 'none';
        departmentTypeSection.style.display = 'none';

        // Get the selected account type
        const selectedAccountType = accountTypeSelect.value;

        // Show the relevant sections based on the selected account type
        if (selectedAccountType === 'REQUESTER') {
            schoolTypeSection.style.display = 'block';
            document.getElementById('inputStateSchool').setAttribute('required', value);
        } else if (selectedAccountType === 'REVIEWER') {
            departmentTypeSection.style.display = 'block';
            document.getElementById('inputState').setAttribute('required', value);
        }
    }

    // Attach the updateFormFields function to the change event of the account type select
    accountTypeSelect.addEventListener('change', updateFormFields);

    // Initial call to set the initial state based on the default value (if any)
    updateFormFields();
});

document.addEventListener("DOMContentLoaded", function () {
    // Function to check if passwords match
    function checkPasswordMatch() {
        var password1 = document.getElementById("password1").value;
        var confirmPassword = document.getElementById("confirm-password1").value;

        // Check if there is user input in the confirm password field
        if (confirmPassword.trim() !== "") {
            // Check if passwords match
            if (password1 !== confirmPassword) {
                document.getElementById("password-match-error").innerHTML = "Passwords do not match!";
            } else {
                document.getElementById("password-match-error").innerHTML = "";
            }
        } else {
            document.getElementById("password-match-error").innerHTML = "";
        }
    }

    // Show password match error only when characters are being input in the confirm password field
    document.getElementById("confirm-password1").addEventListener("input", function () {
        checkPasswordMatch();
    });

    // Hide password match error when the cursor leaves the confirm password field
    document.getElementById("confirm-password1").addEventListener("blur", function () {
        document.getElementById("password-match-error").innerHTML = "";
    });

    // Attach the checkPasswordMatch function to the oninput event of password fields
    document.getElementById("password1").addEventListener("input", checkPasswordMatch);

    // Add AJAX to send asynchronous request to check password match on the server side
    document.getElementById("create-user-form").addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Fetch the form data
        var formData = new FormData(this);

        // Send AJAX request
        fetch("check_password_match.php", {
            method: "POST",
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    document.getElementById("password-match-error").innerHTML = data.error;
                } else {
                    // Continue with form submission
                    this.submit();
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
    });
});


