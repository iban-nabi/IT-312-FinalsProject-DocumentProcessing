<?php

/**
 * Author/s: Jay Ron Imbuido
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

global $conn;

// Function to create user
if (isset($_POST['create'])) {
    include "connection_db.php";
    // Include your encryption function
    include_once '../../encryption.php';
    $secretKey = hex2bin('b36cdff9bdaeb3dbd39c4d308eaff2ca524f27b4f9db9071e4f2248e51989a43');

    // Function to validate input data, remove HTML tags, and sanitize against SQL injection
    function sanitizeInput($data)
    {
        global $conn;
        if (is_array($data)) {
            // If $data is an array, apply sanitizeInput to each element
            return array_map('sanitizeInput', $data);
        } else {
            // If $data is a string, apply trim, strip_tags, and mysqli_real_escape_string
            return mysqli_real_escape_string($conn, strip_tags(trim($data)));
        }
    }

    // variables that hold user input from the input fields
    $username = sanitizeInput($_POST['username']);
    $password = sanitizeInput($_POST['password']);
    $confirm_password = sanitizeInput($_POST['confirm-password']);
    $account_type = sanitizeInput($_POST['account-type']);
    $first_name = sanitizeInput($_POST['first_name']);
    $last_name = sanitizeInput($_POST['last_name']);
    $school = sanitizeInput($_POST['school']);
    $department = sanitizeInput($_POST['department']);

    // Check if passwords match
    function checkPasswordMatch($password, $confirmPassword)
    {
        return $password === $confirmPassword;
    }

    // Validates if the input fields are empty
    $user_data = 'acct_username=' . $username . '&acct_fname=' . $first_name . '&acct_lname=' . $last_name;
    $empty_fields = array();

    if (empty($username)){
        $empty_fields[] = "Username";
    }
    if (empty($first_name)){
        $empty_fields[] = "First name";
    }
    if (empty($last_name)){
        $empty_fields[] = "Last name";
    }
    if (empty($password)){
        $empty_fields[] = "Password";
    }
    if (empty($confirm_password)){
        $empty_fields[] = "Password confirmation";
    }
    if (empty($account_type)){
        $empty_fields[] = "Type of account";
    }
    if (!empty($emptyFields)) {
        $error = "The following required fields are empty: " . implode(', ', $empty_fields);
        header("Location: ../add-user.php?error=" . urlencode($error));
        exit();
    }

    // Validates if the password and confirm-password are match
    if (!checkPasswordMatch($password, $confirm_password)) {
        $error = "Passwords do not match!";
        header("Location: ../add-user.php?error=" . urlencode($error) . "&$user_data");
        exit();
    }

    // Encrypts the user input password
    $PasswordEncrypted = encryptString($password, $secretKey);
    // Check if the user is already existing
    $check_username = "SELECT COUNT(*) FROM account WHERE acct_username = '$username'";
    $result_username = $conn->query($check_username);

    // Setting up the default email for the user
    $domain = "@slu.edu.ph";
    $email = $username . $domain;

    if ($result_username){
        $row = mysqli_fetch_array($result_username);
        $username_count = $row[0];

        if ($username_count > 0) {
            // Username already exists, handle the error
            header("Location: ../add-user.php?action=add-user?error=Username already exists&$user_data");
            exit();
        }

        // Sets the default account status to active
        $account_status = 'ACTIVE';

        // Validates which user type is the user
        switch ($account_type){
            // If the user created is ADMIN then the necessary fields will be filled for ADMIN only
            case 'ADMIN':
                $sql_admin = "INSERT INTO account (acct_username, password, acct_fname, acct_lname, acct_type, status, email)
                    VALUES ('$username', '$PasswordEncrypted', '$first_name', '$last_name', '$account_type', '$account_status', '$email')";
                $result_admin = mysqli_query($conn, $sql_admin);

                if ($result_admin) {
                    // Successfully inserted into account table
                    header("Location: ../dashboard.php?successful=User created successfully");
                    exit();
                } else {
                    // Insert into account table failed
                    $error_message = mysqli_error($conn); // Get the actual error message
                    header("Location: ../add-user.php?error=$error_message&$user_data");
                    exit();
                }
            // If the user created is REQUESTER then the necessary fields will be filled for such as the school type
            case 'REQUESTER':
                $user_data = 'school_id=' . $school;
                if (empty($school)){
                    $empty_fields[] = "School department";
                }
                $sql_requester = "INSERT INTO account (acct_username, password, acct_fname, acct_lname, acct_type, school_id, status, email)
                                VALUES ('$username', '$PasswordEncrypted', '$first_name', '$last_name', '$account_type', '$school', '$account_status', '$email')";
                $result_requester = mysqli_query($conn, $sql_requester);

                if ($result_requester) {
                    // Successfully inserted into account table
                    header("Location: ../dashboard.php?success=User created successfully");
                    exit();
                } else {
                    // Insert into account table failed
                    $error_message = mysqli_error($conn); // Get the actual error message
                    header("Location: ../add-user.php?error=$error_message&$user_data");
                    exit();
                }
            // If the user created is REQUESTER then the necessary fields will be filled for such as the department type
            case 'REVIEWER':
                $user_data = 'revofc_id=' . $department;
                if (empty($department)){
                    $empty_fields[] = "School department";
                }
                $sql_reviewer= "INSERT INTO account (acct_username, password, acct_fname, acct_lname, acct_type, revofc_id, status, email)
                                VALUES ('$username', '$PasswordEncrypted', '$first_name', '$last_name', '$account_type', '$department', '$account_status', '$email')";
                $result_reviewer = mysqli_query($conn, $sql_reviewer);

                if ($result_reviewer) {
                    // Successfully inserted into account table
                    header("Location: ../dashboard.php?successful=User created successfully");
                    exit();
                } else {
                    // Insert into account table failed
                    $error_message = mysqli_error($conn); // Get the actual error message
                    header("Location: ../add-user.php?error=$error_message&$user_data");
                    exit();
                }
            default:
                // Handle other user types or errors
                header("Location: ../dashboard.php?error=Invalid user type&$user_data");
                exit();
        }

    } else {
        // Insert into account table failed
        $error_message = mysqli_error($conn); // Get the actual error message
        header("Location: ../dashboard.php?error=$error_message&$user_data");
        exit();
    }


}
