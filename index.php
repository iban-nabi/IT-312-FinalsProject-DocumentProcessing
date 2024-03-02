<?php
    global $conn;
    session_start();
    include "PHP/connection_db.php";
    if (isset($_SESSION['acct_username'])) {
        $type = $_SESSION['acct_type']; // Assuming you store the user's type in the session

        if ($type == 'ADMIN') {
            header("Location: ../databeasts-final/PHP/Admin/dashboard.php");
            exit();
        }
    }

    if (isset($_POST['submit'])) {
        $Username = $_POST['acct_username'];
        $Password = $_POST['password'];

        $sql = "SELECT * FROM users WHERE acct_username = '$Username' AND password = '$Password'";
        $result = mysqli_query($conn, $sql);

        if ($row = mysqli_fetch_assoc($result)) {
            $_SESSION['acct_username'] = $row['acct_username'];
            $_SESSION['acct_type'] = $row['acct_type'];

            switch ($row['acct_type']) {
                case 'ADMIN':
                    header("Location: PHP/Frontend/Admin/dashboard.php");
                    break;
                default:
                    header("Location: ../index.php?id=$Username&error=Invalid Credentials");
                    break;
            }
        } else {
            header("Location: index.php?id=$Username&error=Invalid Credentials");
        }
    }
?>
<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Document Tracker</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
        <link href="PHP/stylesheet/style.css" rel="stylesheet">
        <link rel="icon" type="image/png" href="images/slu-logo.png">
    </head>
    <body>
        <special-login-header></special-login-header>
        <div class="container-fluid p-0 m-0 bg-white">
            <div class="d-sm-flex m-0 p-0">
                <img class="w-50 d-none d-sm-block" src="images\SLU Building.jpg" alt="slu_building" style="background-size: cover;">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <img class="img-fluid w-50 justify-content-center w-sm-25" src="images/slu-logo.png" alt="slu_logo">
                    <h1 class="text-center text-darkblue">Admin Login</h1>
                    <?php if (isset($_GET['error'])) { ?>
                        <div class="alert alert-danger" role="alert">
                            <?php echo $_GET['error']; ?>
                        </div>
                    <?php } ?>
                    <form action="PHP/login.php" method="POST" id="form">
                        <div id="username"  class="input-group mb-2">
                            <div class="input-group-prepend">
                                <span class="input-group-text prepend-color">
                                    <i class="bi bi-person-fill color-white"></i>                            
                                </span>
                            </div>
                            <input class="form-control input-color" input type="text" id="input-box" name="acct_username" placeholder="Username">
                        </div>
                        <div id="password" class="input-group mb-2">
                            <div class="input-group-prepend">
                                <span class="input-group-text blue-border prepend-color">
                                    <i class="bi bi-lock-fill color-white"></i>     
                                </span>                   
                            </div>
                            <input class="form-control input-color" type="password" id="input-box" name="password" placeholder="Password">
                        </div>
                        <div id="button" class="my-3 text-center btn-block">
                            <button type="submit" class="btn btn-warning" name="submit">Login</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <special-footer></special-footer>
        <script src="PHP/Frontend/script.js"></script>
        
    </body>
</html>
