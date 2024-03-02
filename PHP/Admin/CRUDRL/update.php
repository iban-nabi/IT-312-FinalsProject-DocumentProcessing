<?php

/**
 * Author/s: Jay Ron Imbuido
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

global $conn;
if (isset($_GET['id'])) {
    include "connection_db.php";

    // Function to validate input data
    function validate($data)
    {
        if (is_array($data)) {
            // If $data is an array, apply trim to each element
            return array_map('trim', $data);
        } else {
            // If $data is a string, apply trim
            return trim($data);
        }
    }
    // Retrieve the primary key
    $id = validate($_GET['id']);

    $sql = "SELECT * FROM account WHERE acct_username = '$id'";

    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
    } else {
        header("Location: ../dashboard.php");
    }
} else if (isset($_POST['update'])) {
    include "connection_db.php";
    include_once '../../encryption.php'; // Update the path accordingly
    $secretKey = hex2bin('b36cdff9bdaeb3dbd39c4d308eaff2ca524f27b4f9db9071e4f2248e51989a43');

    // Function to validate input data
    function validate($data)
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

    // Get the data from the form
    $id = validate($_POST['user_id']);
    $username = validate($_POST['username']);
    $password = validate($_POST['password']);
    $confirm_password = isset($_POST['confirm-password']) ? validate($_POST['confirm-password']) : null;
    $accountType = validate($_POST['account-type']);
    $school = isset($_POST['school']) ? validate($_POST['school']) : null;
    $department = isset($_POST['department']) ? validate($_POST['department']) : null;
    $email = validate($_POST['email']);

    // Check if passwords match
    function checkPasswordMatch($password, $confirmPassword)
    {
        return $password === $confirmPassword;
    }

    // Check if at least one field is filled (other than required fields)
    if (empty($username) && empty($email) && empty($password)) {
        header("Location: ../edit-info.php?id=$username&error=No fields to update");
        exit();
    }
    switch ($accountType) {
        case 'REQUESTER':
            $sql = "UPDATE account SET";

            if (!empty($username)) {
                $sql .= " acct_username ='$username',";
            }

            if (!empty($email)) {
                $sql .= " email='$email',";
            }

            if (!empty($accountType)) {
                $sql .= " acct_type='$accountType',";
            }

            if (!empty($school)) {
                $sql .= " school_id='$school', revofc_id=null ,";
            }

            // Remove trailing comma
            $sql = rtrim($sql, ',');

            $sql .= " WHERE acct_username='$id'";
            break;

        case 'REVIEWER':
            $sql = "UPDATE account SET";

            if (!empty($username)) {
                $sql .= " acct_username ='$username',";
            }

            if (!empty($email)) {
                $sql .= " email='$email',";
            }

            if (!empty($accountType)) {
                $sql .= " acct_type='$accountType',";
            }

            if (!empty($department)) {
                $sql .= " revofc_id='$department', school_id=null,";
            }

            // Remove trailing comma
            $sql = rtrim($sql, ',');

            $sql .= " WHERE acct_username='$id'";
            break;

        case 'ADMIN':
            $sql = "UPDATE account SET";

            if (!empty($username)) {
                $sql .= " acct_username ='$username',";
            }

            if (!empty($accountType)) {
                $sql .= " acct_type='$accountType',";
            }

            if (!empty($department && $school)) {
                $sql .= " revofc_id=null, school_id=null, ";
            }

            if (!empty($email)) {
                $sql .= " email='$email',";
            }

            // Remove trailing comma
            $sql = rtrim($sql, ',');

            $sql .= " WHERE acct_username='$id'";
            break;

        default:
            header("Location: ../dashboard.php?action=update-user&id=$id&error=Invalid user type");
            exit();

    }
    // If the password is not null then it will proceed to updating and set the new password
    if ($password !== null) {
        if (!empty($confirm_password)) {
            if (!checkPasswordMatch($password, $confirm_password)) {
                $error = "Passwords do not match!";
                header("Location: ../edit-info.php?id=$id&error=" . urlencode($error));
                exit();
            }

            $PasswordEncrypted = encryptString($password, $secretKey);
            $sqlUserUpdate = "UPDATE account SET password='$PasswordEncrypted' WHERE acct_username='$id' AND NOT password IS NULL";
            $resultUserUpdate = mysqli_query($conn, $sqlUserUpdate);

            if (!$resultUserUpdate) {
                header("Location: ../dashboard.php?error=Password update failed $username");
                exit();
            }
        }
    }


    // Execute the SQL statement
    $result = mysqli_query($conn, $sql);

    if ($result !== false) {
        $rowsAffected = mysqli_affected_rows($conn);
        if ($rowsAffected > 0) {
            // Changes were made
            header("Location: ../dashboard.php?successful=$username updated successfully");
            exit();
        } else {
            // No changes were made
            header("Location: ../dashboard.php?id=$username&notification=No changes were made");
            exit();
        }
    } else {
        // Error handling
        //echo "Error updating record: " . mysqli_error($conn);
        header("Location: ../dashboard.php?error=Error updating $username");
        exit();
    }
}
?>
