<?php
    error_reporting(E_ALL);
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
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="icon" type="image/png" href="../media-repo/slu-logo.png">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="admin-style.css">
    <title>Create New User</title>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-dark">
    <a class="navbar-brand" href="dashboard.php"><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarCollapse">
        <ul class="navbar-nav mr-auto">
            <li class="bg-add-user">
                <a class="nav-link" href=""><b class="bi bi-person-add">&nbsp;Add User</b></a>
            </li>
            <li class="bg-archive">
                <a class="nav-link " href="archive-accounts.php"><b class="bi bi-file-zip">&nbsp;Archive Accounts</b></a>
            </li>
            <li class="bg-logs">
                <a class="nav-link" href="view-logs.php"><b class="bi bi-file-text">&nbsp;View Logs</b></a>
            </li>
        </ul>
        <span class="bg-logout navbar-text">
                <a class="logout" href="../logout.php"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
          </span>
    </div>
</nav>

    <form action="CRUDRL/create.php" method="post">
        <div class="main-container">
            <section class="bg-darkblue p-3 rounded-4">
                <?php if (isset($_GET['error'])) { ?>
                    <div class="alert alert-danger" role="alert">
                        <?php echo $_GET['error']; ?>
                    </div>
                <?php } ?>
                <section class="bg-white p-3 opacity-70 rounded-2">
                    <div class="add-user my-0">
                        <h1 class="my-0 pe-3">Add New User</h1>
                        <a id="cancel" class="my-0" href="dashboard.php"><h4>Cancel Adding</h4></a>
                    </div>
                    <div class="sub-container">
                        <div class="row">
                            <div class="col">
                                <form>
                                    <div class="form-group">
                                        <label for="username">Username</label>
                                        <input type="text" name="username" class="form-control" id="username" aria-describedby="username" placeholder="Enter username" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="username">First Name</label>
                                        <input type="text" name="first_name" class="form-control" id="first_name" aria-describedby="first_name" placeholder="Enter first name" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="username">Last Name</label>
                                        <input type="text" name="last_name" class="form-control" id="last_name" aria-describedby="last_name" placeholder="Enter last name" required>
                                    </div>
                                </form>
                            </div>
                            <div class="col">
                            <div class="form-group">
                                        <label for="password1">Password</label>
                                        <input type="password" name="password" class="form-control" id="password1" placeholder="Password" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="confirm-password1">Confirm Password</label>
                                        <input type="password" name="confirm-password" class="form-control" id="confirm-password1" placeholder="Confirm Password" required>
                                        <div id="password-match-error" class="text-danger"></div>
                                    </div>
                                <div class="form-group">
                                    <label for="accountType">Account Type</label>
                                    <select id="accountType" class="form-control" name="account-type" required>
                                        <option value="">Select Account Type</option>
                                        <option value="REQUESTER">Requester</option>
                                        <option value="REVIEWER">Reviewer</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                                <button type="submit" class="btn-create btn btn-primary" name="create">Create User</button>
                                <!-- Add the following sections with style="display: none;" -->
                                <div class="form-group" id="schoolTypeSection" style="display: none;">
                                    <label for="inputStateSchool">School Type</label>
                                    <select id="inputStateSchool" name="school" class="form-control">
                                        <option selected>Select school</option>
                                        <?php
                                            global $conn;
                                            include "connection_db.php";
                                            $school_type = mysqli_query($conn, "SELECT * FROM school");
                                            while ($school = mysqli_fetch_array($school_type)){
                                                ?>
                                                <option value="<?php echo $school['school_id']?>"><?php echo $school['school_name'] ?></option>
                                        <?php } ?>
                                    </select>
                                </div>

                                <div class="form-group" id="departmentTypeSection" style="display: none;">
                                    <label for="inputStateDepartment">Department Type</label>
                                    <select id="inputStateDepartment"  name="department" class="form-control">
                                        <option selected>Select department</option>
                                        <?php
                                        global $conn;
                                        include "connection_db.php";
                                        $department_type = mysqli_query($conn, "SELECT * FROM rev_office");
                                        while ($office = mysqli_fetch_array($department_type)){
                                            ?>
                                            <option value="<?php echo $office['revofc_id']?>"><?php echo $office['dept_name'] ?></option>
                                        <?php } ?>
                                    </select>
                                </div>


                            </div>
                        </div>
                    </div>

                </section>
            </section>
            <br>
            <br>
            <br>
            <br>
            <br>
        </div>
    </form>


    <special-footer></special-footer>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="script.js"></script>

</body>
</html>