<?php

/**
 * Author/s: Jay Ron Imbuido
 */

global $conn;
include "connection_db.php";

// Initial SQL query
$sql = "SELECT d.doc_title, d.version,
a.acct_username,
t.trn_date, t.trn_status, r.dept_name
FROM transaction t 
join document d using (doc_id, version, acct_username)
join rev_office r using (revofc_id)
join account a using (acct_username)
join school s using (school_id)
        WHERE a.status = 'ACTIVE' ORDER BY t.trn_date DESC";

// Execute the modified SQL query
$results = mysqli_query($conn, $sql);

$data = array(); // Initialize an array to store the data

if (!$results) {
    // Query execution failed, handle the error
    $error_message = "Error: " . mysqli_error($conn);
} else {
    // Query executed successfully
    $num_rows = mysqli_num_rows($results);
    // Check if the table is not empty
    if ($num_rows > 0) {
        while ($row = mysqli_fetch_assoc($results)) {
            $data[] = $row;
        }
        // Set the transaction to proper display value
        foreach ($data as $key => $row) {
            $data[$key]['event'] = " ";
            if ($row['trn_status'] == 'PENDING' && $row['version'] == '1') {
                $newString = $row['acct_username'] . ' has uploaded a new document for ' . $row['dept_name'] . ' to review.';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'REVIEWING') {
                $newString = $row['dept_name'] . ' is currently reviewing the document. ';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'RETURNED') {
                $newString = $row['dept_name'] . ' has annotated and returned the document for revisions. ';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'PENDING' && $row['version'] != '1') {
                $newString = $row['acct_username'] . ' has uploaded a revised document for ' . $row['dept_name'] . ' to review.';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'APPROVED' && $row['dept_name'] != 'OVP for Administration') {
                $newString = $row['dept_name'] . ' has approved the document and forwarded it to the next department for reviewing.';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'PENDING' && $row['dept_name'] != 'OGRAA') {
                $newString = $row['dept_name'] . ' has received an approved document from the previous department.';
                $data[$key]['event'] = $newString;
            } else if ($row['trn_status'] == 'APPROVED' && $row['dept_name'] == 'OVP for Administration') {
                $newString = 'The document submitted by ' . $row['acct_username'] . ' has been fully approved by all 5 departments!';
                $data[$key]['event'] = $newString;
            } else {
                $data[$key]['event'] = " ";
            }
        }

    } else {
        // Display the error message
        $error_message = "No records found.";
    }
}
?>