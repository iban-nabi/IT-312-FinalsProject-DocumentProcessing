<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
global $data, $row;
include "connection_db.php";
include "CRUDRL/user-activity.php";
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
      <link rel="icon" type="image/png" href="../media-repo/slu-logo.png"><link rel="icon" type="image/png" href="../media-repo/slu-logo.png"><link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
      <link rel="stylesheet" href="style.css">
      <link rel="stylesheet" href="admin-style.css">
      <title>Activity Logs</title>
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
                    <a class="nav-link " href="archive-accounts.php"><b class="bi bi-file-zip">&nbsp;Archive Accounts</b></a>
                </li>
                <li class="bg-logs">
                    <a class="nav-link" href=""><b class="bi bi-file-text">&nbsp;View Logs</b></a>
                </li>
            </ul>
            <span class="bg-logout navbar-text">
                <a class="logout" href="../logout.php"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
            </span>
        </div>
    </nav>
        <div class="main-container">
            <section class="new-bg-white">
            <div class="intro">
                <h1 class="my-0">User Activity</h1> 
              </div>
              <section class="table-cont">
                <?php if (isset($error_message)) { ?>
                    <div class="alert alert-danger" role="alert">
                        <?php echo $error_message; ?>
                    </div>
                <?php } ?>
                
      <section class="main-container-bg bg-darkblue rounded-4">
         <div class="p-3">
            <div class="table-div-logs">
              <table class="table rounded-3 overflow-hidden mt-3 table-bordered">
                    <thead class="thead" style="position: sticky;top: 0">
                      <tr>
                        <th class="header" scope="col">Date and Time</th>
                        <th class="header" scope="col">Document Title</th>
                        <th class="header" scope="col">Version</th>
                        <th class="header" scope="col">Status</th>
                        <th class="header" scope="col">Event</th>
                      </tr>
                    </thead>
                    <?php
                    $i = 0;
                    foreach ($data as $row) {
                    $i++;
                    ?>
                      <tbody class="table-content">
                        <tr>
                            <th scope="row"><?= $row['trn_date'] ?></th>
                            <td><?= $row['doc_title'] ?></td>
                            <td><?= $row['version'] ?></td>
                            <td><?= $row['trn_status'] ?></td>
                            <td><?= $row['event'] ?></td>
                          </tr>
                      </tbody>
                    <?php } ?>
                  </table>
              </div>
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