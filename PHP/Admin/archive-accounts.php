<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
global $data, $row;
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

$sql = "SELECT a.acct_lname, a.acct_fname, a.acct_username, a.acct_type, a.email, a.status, s.school_name, s.school_id  FROM account a
        LEFT JOIN school s ON s.school_id = a.school_id WHERE a.status = 'INACTIVE'";
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
        $error_message = "No records found.";
    }
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
        <title>Deactivated Users</title>
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
                      <a class="nav-link" href="add-user.php"><b class="bi bi-person-add">&nbsp;Add User</b></a>
                  </li>
                  <li class="bg-archive">
                      <a class="nav-link " href=""><b class="bi bi-file-zip">&nbsp;Archive Accounts</b></a>
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

            <h1 class="my-0 pe m-5"><b>Deactivated Accounts</b></h1>
            <div class="main-container bg-darkblue rounded-4">    
                <section class="main-container p-3 opacity-70 rounded-2">
                    <table class="table rounded-3 overflow-hidden mt-3 table-bordered">
                        <?php if (isset($error_message)) { ?>
                            <div class="alert alert-danger" role="alert">
                                <?php echo $error_message; ?>
                            </div>
                        <?php } ?>
                        <thead class="thead">
                           <tr>
                            <th scope="col">#</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Account Type</th>
                            <th scope="col">Email</th>
                            <th scope="col">School</th>
                            <th scope="col">Status</th>
                            <th scope="col">Action</th>
                          </tr>
                        </thead>
                        <tbody class="table">
                        <?php
                        $i = 0;
                        foreach ($data as $row) {
                        $i++;
                        ?>
                            <tr>
                                <th scope="row"><?= $i ?></th>
                                <td><?= $row['acct_lname'] ?></td>
                                <td><?= $row['acct_fname'] ?></td>
                                <td><?= $row['acct_type'] ?></td>
                                <td><?= $row['email'] ?></td>
                                <td><?= $row['school_name'] ?></td>
                                <td><?= $row['status'] ?></td>
                                <td>
                                    <ol class="button-list"><a class="btn btn-primary" href="CRUDRL/reactivate.php?id=<?= $row['acct_username'] ?>"><b class="bi bi-person-fill-add">&nbsp;Reactivate User</b></a></ol>
                                </td>
                            </tr>
                        <?php } ?>
                        </tbody>
                    </table>
                </section>
                <br>
                <br>
                <br>
                <br>
                <br>
            </div>
        <special-footer></special-footer>

    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="script.js"></script>
</body>
</html>