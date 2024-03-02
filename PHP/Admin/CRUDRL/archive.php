<?php

/**
 * Author/s: Jay Ron Imbuido
 */

global $conn;
if (isset($_GET['id'])) {
    include "../connection_db.php";
    function validate($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    // Retrieve the primary key of the user
    $id = validate($_GET['id']);

    // Check if the user is an admin before attempting to deactivate
    $sqlCheckAdmin = "SELECT acct_type FROM account WHERE acct_username='$id'";
    $resultCheckAdmin = mysqli_query($conn, $sqlCheckAdmin);

    if ($resultCheckAdmin) {
        $row = mysqli_fetch_assoc($resultCheckAdmin);
        if ($row['acct_type'] === 'ADMIN') {
            header("Location: ../dashboard.php?id=$id&error=Admin users cannot be ARCHIVED!");
            exit();
        }
    }

    // If the user is not an admin, proceed with the deactivating of the account
    $sqlArchive = "UPDATE account SET status = 'INACTIVE' WHERE acct_username='$id'";
    $resultArchive = mysqli_query($conn, $sqlArchive);

    // If the deactivating account is successful then it will display success message, otherwise, it will return an error message
    if ($resultArchive) {
        header("Location: ../dashboard.php?id=$id&successful=Deactivated Successfully");
        exit();
    } else {
        header("Location: ../dashboard.php?id=$id&error=Unknown Error Occurred");
        exit();
    }
} else {
    // Handling error
    header("Location: ../dashboard.php");
    exit();
}
?>
