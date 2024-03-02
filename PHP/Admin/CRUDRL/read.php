<?php

/**
 * Author/s: Jay Ron Imbuido
 */

global $conn;
include "connection_db.php";


// Display query
$sql = "SELECT a.acct_username, a.acct_fname, a.acct_lname, a.acct_type, a.email, CONCAT_WS(' ', s.school_name, ro.dept_name) as department, ro.revofc_id, s.school_id  
        FROM account a
        LEFT JOIN rev_office ro ON ro.revofc_id = a.revofc_id
        LEFT JOIN school s ON s.school_id = a.school_id 
        WHERE a.status = 'ACTIVE'";

// Check if a sorting parameter is present in the URL
if (isset($_GET['sort'])) {
    $sortType = $_GET['sort'];

    // Query for the sorting type
    switch ($sortType) {
        case 'reviewer':
            $sql .= " ORDER BY a.acct_type = 'REVIEWER' DESC";
            break;
        case 'requester':
            $sql .= " ORDER BY a.acct_type = 'REQUESTER' DESC";
            break;
        default:
            // Displays an error message on the dashboard
            $error = "User does not exist.";
            break;
    }
}
// Check if the search parameter is present in the url
if (isset($_GET['search'])) {
    $search_user = $_GET['search'];
    // Query for displaying users with matching characters from the search input
    $sql = "SELECT a.acct_username, a.acct_fname, a.acct_lname, a.acct_type, a.email, CONCAT_WS(' ', s.school_name, ro.dept_name) as department, ro.revofc_id, s.school_id 
            FROM account a 
            LEFT JOIN rev_office ro ON ro.revofc_id = a.revofc_id
            LEFT JOIN school s ON s.school_id = a.school_id 
            WHERE CONCAT(acct_username, acct_fname, acct_lname, email) LIKE '%$search_user%' AND a.status = 'ACTIVE'";

}
// Execute the modified SQL query
$result = mysqli_query($conn, $sql);

$data = array(); // Initialize an array to store the data

if (!$result) {
    // Query execution failed, handle the error
    echo "Error: " . mysqli_error($conn);
} else {
    // Query executed successfully
    $num_rows = mysqli_num_rows($result);

    if ($num_rows > 0) {
        // Process and store the results in the data array
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
    } else {
        // Displays an error message on the dashboard
        $error = "User does not exist.";
    }
}
?>
