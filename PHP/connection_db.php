<?php
    /**
     * Author/s: Jay Ron Imbuido
     */

    // Set error reporting
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    // Log errors to a file
    ini_set('log_errors', 1);
    ini_set('error_log', '/var/apache/error.log');

    $_SERVER = "localhost";
    $username = "root";
    $password = "";
    $db_name = "databeasts-final";
    $conn = new mysqli($_SERVER , $username, $password, $db_name);
    if ($conn->connect_error) {
        error_log("Connection Failed: " . $conn->connect_error);
    }
?>
