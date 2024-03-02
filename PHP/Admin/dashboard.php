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

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Dashboard</title>
    <link rel="icon" type="image/png" href="../media-repo/slu-logo.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css" integrity="sha512-YWzhKL2whUzgiheMoBFwW8CKV4qpHQAEuvilg9FAn5VJUDwKZZxkJNuGM4XkWuk94WCrrwslk8yWNGmY1EduTA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="admin-style.css">
</head>
  <body>      
  <nav class="navbar navbar-expand-lg navbar-dark">
      <a class="navbar-brand" href=""><b class="bi bi-file-earmark-text-fill ps-4">&nbsp;Document Review System</b></a>
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
            <a class="nav-link" href="view-logs.php"><b class="bi bi-file-text">&nbsp;View Logs</b></a>
        </li>
        </ul>
        <span class="bg-logout navbar-text">
          <a class="logout" href="../logout.php"><b class="bi bi-box-arrow-right">&nbsp;Logout</b></a>
      </span>
      </div>
    </nav>
<div class="main-container">
    <h2 id="head" style="text-align:center">Welcome,
        <?php echo $_SESSION['acct_type']; ?>!
    </h2>
    <form method="GET">
        <div class="input-group mb-2">
            <input type="text" name="search" value="<?php if(isset($_GET['search'])){ echo $_GET['search'];}?>" class="form-control" placeholder="search user">
            <button type="submit" class="btn btn-outline-secondary">Search</button>
        </div>
    </form>

    <h5 class="sort-table">Sort Table By:</h5>
    
        <button type="button" class="btn-reviewer btn btn-primary" style="background-color: #17284E;" onclick="sortList('reviewer')">Reviewer</button>
        <button type="button" class="btn-requester btn btn-primary" style="background-color: #17284E;" onclick="sortList('requester')">Requester</button>

        <section class="bg-darkblue-container bg-darkblue p-3 rounded-4">
           <table class="table">
               <?php if (isset($_GET['successful'])) { ?>
                   <div class="alert alert-success" role="alert">
                       <?php echo $_GET['successful']; ?>
                   </div>
               <?php } ?>
               <?php if (isset($_GET['error'])) { ?>
                   <div class="alert alert-danger" role="alert">
                       <?php echo $_GET['error']; ?>
                   </div>
               <?php } ?>
               <?php if (isset($_GET['notification'])) { ?>
                   <div class="alert alert-success" role="alert">
                       <?php echo $_GET['notification']; ?>
                   </div>
               <?php } ?>
               <?php if (isset($error)) { ?>
                   <div class="alert alert-danger" role="alert">
                       <?php echo $error; ?>
                   </div>
               <?php } ?>
                <thead class="thead">
                <tr>
                    <th scope="col">Username</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Account Type</th>
                    <th scope="col">Email</th>
                    <th scope="col">Department</th>
                    <th scope="col">Operations</th>
                </tr>
                </thead>
                <?php
                $i = 0;
                foreach ($data as $row) {
                    $i++;
                    ?>
                    <tbody>
                    <td><?= $row['acct_username'] ?></td>
                    <td><?= $row['acct_fname'] ?></td>
                    <td><?= $row['acct_lname'] ?></td>
                    <td><?= $row['acct_type'] ?></td>
                    <td><?= $row['email'] ?></td>
                    <td><?= $row['department'] ?></td>
                    <td>
                        <a href="edit-info.php?id=<?= $row['acct_username'] ?>" id="edit-btn"><i class="fa-solid fa-pen" style="color: #ffffff;"></i> Edit</a>
                        <a href="CRUDRL/archive.php?id=<?= $row['acct_username'] ?>" id="archive-btn"><i class="fa-solid fa-trash-can" style="color: #ffffff;"></i> Deactivate User</a>
                    </td>
                    </tbody>
                <?php } ?>
            </table>
        </section>
    </div>
    <br>
    <br>
    <br>
    <special-footer></special-footer>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
    <script src="script.js"></script>
</body>
</html>