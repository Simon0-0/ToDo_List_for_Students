
-- ROLE
CREATE TABLE stuorgRole
(
roleid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
-- Primary key: roleid
roletype NVARCHAR (50) NOT NULL,
roledescription NVARCHAR (255),
); 


-- LABLE
CREATE TABLE stuorgTaskLabel
(
labelid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
-- Primary key: labelid
labeldescription NVARCHAR (255) NOT NULL ,
); 


-- USER
CREATE TABLE stuorgUser
(
userid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
-- Primary key: userid
username NVARCHAR (50) NOT NULL,
email NVARCHAR (50) NOT NULL,
); 


-- ACCOUNT
CREATE TABLE stuorgAccount
(
accountid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
-- Primary key: accountID
displayname NVARCHAR (50) NOT NULL,
accountdescription NVARCHAR (MAX), 
FK_userid INT UNIQUE,

CONSTRAINT [not sure what to put here...] FOREIGN KEY (FK_userid) REFERENCES stuorgUser (userid)
);

-- PASSWORD
CREATE TABLE stuorgPassword
(
FK_accountid INT NOT NULL UNIQUE,
hashedpassword NVARCHAR(255) NOT NULL,

CONSTRAINT [not sure what to put here...] FOREIGN KEY (FK_accountid) REFERENCES stuorgAccount (accountid)
);


-- TASK
CREATE TABLE stuorgTask
(
taskid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
FK_labelid INT UNIQUE,
FK_ownerid INT UNIQUE,
taskduedate INT,
tasksubject NVARCHAR(50),

CONSTRAINT stuorgFK_task_label FOREIGN KEY (FK_labelid) REFERENCES stuorgTaskLabel (labelid),

CONSTRAINT stuorgFK_task_user FOREIGN KEY (FK_ownerid) REFERENCES stuorgUser (userid),

)

-- GROUP
CREATE TABLE stuorgGroup
(
groupid INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
FK_userid INT UNIQUE,
groupdescription NVARCHAR(255) NOT NULL


CONSTRAINT stuorFK_Group_User FOREIGN KEY (FK_userid) REFERENCES stuorgUser (userid)
);


--GROUP TASK
CREATE TABLE stuorgGroupTask
(
FK_taskid INT UNIQUE,
FK_groupid INT UNIQUE,
FK_userid INT UNIQUE,


CONSTRAINT stuorFK_GroupTask_User FOREIGN KEY (FK_userid) REFERENCES stuorgUser (userid),
CONSTRAINT stuorFK_GroupTask_Group FOREIGN KEY (FK_groupid) REFERENCES stuorgGroup (groupid),
CONSTRAINT stuorFK_GroupTask_Task FOREIGN KEY (FK_taskid) REFERENCES stuorgTask (taskid)
);

--STUORGUSERGROUP

CREATE TABLE stuorgUserGroup
(
FK_groupid INT NOT NULL,
FK_userid INT NOT NULL,
CONSTRAINT PK_UserGroup PRIMARY KEY
    (
        groupid,
        userid
    ),
FOREIGN KEY (FK_userid) REFERENCES stuorgUser (userid),
FOREIGN KEY (FK_groupid) REFERENCES stuorgUser (groupid)
);