<?php

/**
 * Author/s: Jay Ron Imbuido
 */

global $conn;

if (isset($_GET['id'])) {
    include "connection_db.php";
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
    // Retrieving the primary key of the user
    $id = validate($_GET['id']);

    // Reactivating account
    $sqlArchive = "UPDATE account SET status = 'ACTIVE' WHERE acct_username='$id'";
    $resultArchive = mysqli_query($conn, $sqlArchive);
    // If successful, it will redirect to dashboard with success message, otherwise it will display error message
    if ($resultArchive) {
        header("Location: ../dashboard.php?id=$id&successful=Reactivated Successfully");
        exit();
    } else {
        header("Location: ../dashboard.php?id=$id&error=Unknown Error Occurred");
        exit();
    }
} else {
    // Error handling
    header("Location: ../archive_accounts.php");
    exit();
}
?>
