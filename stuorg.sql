
-- USER
CREATE TABLE stuorgUser
(
userid INT NOT NULL IDENTITY PRIMARY KEY,
-- Primary key: userid
username NVARCHAR (50) NOT NULL,
email NVARCHAR (50) NOT NULL,
); 


-- ACCOUNT
CREATE TABLE stuorgAccount
(
accountid INT NOT NULL IDENTITY PRIMARY KEY,
-- Primary key: accountID
displayname NVARCHAR (50) NOT NULL,
accountdescription NVARCHAR (MAX), 
FK_userid INT UNIQUE,

CONSTRAINT [not sure what to put here...] FOREIGN KEY (FK_userid) REFERENCES stuorgUser (userid),
);

-- PASSWORD
CREATE TABLE stuorgPassword
(
FK_accountid INT NOT NULL UNIQUE,
hashedpassword NVARCHAR(255) NOT NULL,

CONSTRAINT [not sure what to put here...] FOREIGN KEY (FK_accountid) REFERENCES stuorgAccount (accountid)
);


