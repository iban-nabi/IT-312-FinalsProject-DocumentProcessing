# Document Review System
Our project involves reviewing documents submitted by requesters, with assigned offices handling the review process. The system allows requesters to upload files, resubmit them if necessary, and cancel transactions. They will receive notifications about all activity related to their documents. Requesters can also sort documents on their end and view detailed information about them.

For reviewers, the system sends notifications about new requests and allows them to review documents directly within the webpage. They can also sort data within the review tables.

The administrator has access to user management, allowing them to create new users, edit user details, and view all transactions occurring on the website.

## Prerequisites

### Database
    1. Access the databeasts-final.sql file from the DB directory.
    2. Create a database and name it as databeasts-final. 
    3. Import the sql file and your database is all set.
### Dependencies
    1. Install NodeJS. 
    2. After installing NodeJS, run the command "npm install" to install all dependencies.

## Steps on how to run the website
Ensure that your project is saved inside your wamp server's www directory, usually in the path (\wamp64\www).
### PHP
    1. Once your project is inside the www directory, open your browser and enter 'http://localhost/databeasts-final/' to access the admin side.
### NodeJS
    1. For NodeJS (Reviewer and Requester side), enter the command 'node index.js' in your command prompt to run the server on port 5000.
    2. Go to your browser and enter the URL 'http://localhost:5000/'

## Credentials
### Requester
| Username    | Password   | 
| :--------   | :-------   | 
| `requester1` | `requester` |
| `requester2` | `requester` |
| `requester3` | `requester` |

### Reviewer
| Username    | Password   |  Office Name                  | 
| :--------   | :-------   | :---------------------------- |
| `offfice1`  | `reviewer` | **OGRAA**                     |
| `offfice2`  | `reviewer` | **OVP for Academic Affairs**  |
| `offfice3`  | `reviewer` | **OVP for Finance**           |
| `offfice4`  | `reviewer` | **Office of Legal Affairs**   |
| `offfice5`  | `reviewer` | **OVP for Administration**    |

### Admin
| Username | Password   | 
| :------- | :-------   | 
| `user1`  | `admin`    |

## Authors and acknowledgment
We are students from Saint Louis University in Baguio City currently taking up Bachelor of Science in Information Technology
- [@2220144](https://www.github.com/octokatherine)
- [@2225369](https://gitlab.com/2225369)
- [@Jay_Imbuido](https://gitlab.com/Jay_Imbuido)
- [@2224202](https://gitlab.com/2224202)
- [@2220162](https://gitlab.com/2220162)
- [@2220073](https://gitlab.com/2220073)
