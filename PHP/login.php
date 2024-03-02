<?php
/**
 * Author/s: Jay Ron Imbuido
 */
include_once 'encryption.php';
$secretKey = hex2bin('b36cdff9bdaeb3dbd39c4d308eaff2ca524f27b4f9db9071e4f2248e51989a43');

global $conn;

include("connection_db.php");
session_start();

if (isset($_POST['submit'])) {
    echo "hello";
    $Username = trim($_POST['acct_username']);
    $Password = trim($_POST['password']);
    $PasswordEncrypted = encryptString($Password, $secretKey);


    // Use prepared statements to prevent SQL injection
    $stmt = mysqli_prepare($conn, "SELECT * FROM account WHERE acct_username = ? AND password = ?");
    mysqli_stmt_bind_param($stmt, "ss", $Username, $PasswordEncrypted);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);

    if ($row = mysqli_fetch_assoc($result)) {
        if ($row['status'] == 'ACTIVE') {
            $_SESSION['acct_username'] = $Username;
            $_SESSION['acct_type'] = $row['acct_type'];
            $_SESSION['acct_fname'] = $row['acct_fname'];

            // Determine the user type and redirect accordingly
            switch ($row['acct_type']) {
                case 'ADMIN':
                    header("Location: Admin/dashboard.php");
                    exit();
                default:
                    header("Location: ../index.php?id=$Username&error=Admin accounts only");
                    exit();
            }
        } else {
            // User is inactive
            header("Location: ../index.php?id=$Username&error=Inactive Account");
            exit();
        }
    } else {
        // No user found
        header("Location: ../index.php?id=$Username&error=Invalid-Credentials");
        exit();
    }
}
?>
