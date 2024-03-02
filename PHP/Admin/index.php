<?php
ini_set('display_errors', 1);
global $data, $row;
include "connection_db.php";
include "CRUDRL/read.php";
session_start();
if (!isset($_SESSION['acct_username'])) {
    header("Location: ../../index.php");
    exit();
}
//if user is not admin then destroy session
if ($_SESSION['acct_type'] !== 'ADMIN') {
    session_destroy();
}
header("Location: dashboard.php");
exit();
?>