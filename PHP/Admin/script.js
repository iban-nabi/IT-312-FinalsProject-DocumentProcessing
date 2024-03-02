class SpecialLoginHeader extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="#"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
      </nav>
        `
    }
}

class SpecialHeaderAdmin extends HTMLElement{
    connectedCallback(){
        this.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark">
        <a class="navbar-brand" href="dashboard.php"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarCollapse">
          <ul class="navbar-nav mr-auto">
          <li class="bg-add-user">
          <a class="nav-link" onclick="window.location.href='add-user.php'"><b class="bi bi-person-add">&nbsp;Add User</b></a>
          </li>
          <li class="bg-archive">
              <a class="nav-link " href="archive-accounts.php"><b class="bi bi-file-zip">&nbsp;Archive Accounts</b></a>
          </li>
            <li class="bg-logs">
              <a class="nav-link" href="view-logs.php"><b class="bi bi-file-text">&nbsp;View Logs</b></a>
          </li>
          </ul>
          <span class="bg-logout navbar-text">
            <a class="logout" href="../../PHP/logout.php"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
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

        // Check if there is user input in the confirm-password field
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

    // Show password match error only when characters are being input in the confirm-password field
    document.getElementById("confirm-password1").addEventListener("input", function () {
        checkPasswordMatch();
    });

    // Hide password match error when the cursor leaves the confirm-password field
    document.getElementById("confirm-password1").addEventListener("blur", function () {
        document.getElementById("password-match-error").innerHTML = "";
    });

    // Attach the checkPasswordMatch function to the oninput event of password fields
    document.getElementById("password1").addEventListener("input", checkPasswordMatch);

    // AJAX to send asynchronous request to check password match on the server side
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

// Function to sort the list
function sortList(sortType) {
    window.location.href = 'dashboard.php?sort=' + sortType;
}

document.addEventListener('DOMContentLoaded', function() {
    // Attach the sortList function to the click event of the buttons
    document.querySelector('.btn-reviewer').addEventListener('click', function() {
        sortList('reviewer');
    });

    document.querySelector('.btn-requester').addEventListener('click', function() {
        sortList('requester');
    });
});