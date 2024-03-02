<?php
/**
 * Author/s: Jay Ron Imbuido
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);
session_start();
session_unset(); // Unset all session variables
session_destroy(); // Destroy the session
header("Location: ../index.php");
exit();
?>
