
-- ROLE
CREATE TABLE stuorgRole
(
    roleId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    -- Primary key: roleid
    roleType NVARCHAR (50) NOT NULL,
    roleDescription NVARCHAR (255),
);


-- LABLE
CREATE TABLE stuorgTaskLabel
(
    labelId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    -- Primary key: labelid
    labelDescription NVARCHAR (255) NOT NULL
    ,
);


-- USER
CREATE TABLE stuorgUser
(
    userId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    -- Primary key: userid
    userName NVARCHAR (50) NOT NULL,
    email NVARCHAR (50) NOT NULL,
);


-- ACCOUNT
CREATE TABLE stuorgAccount
(
    accountId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    -- Primary key: accountID
    displayName NVARCHAR (50) NOT NULL,
    accountDescription NVARCHAR (MAX),
    FK_userId INT UNIQUE,

    CONSTRAINT stuorgFK_Account_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId)
);

-- PASSWORD
CREATE TABLE stuorgPassword
(
    FK_accountId INT NOT NULL UNIQUE,
    hashedPassword NVARCHAR(255) NOT NULL,

    CONSTRAINT stuorgFK_Password_Account FOREIGN KEY (FK_accountId) REFERENCES stuorgAccount (accountId)
);


-- TASK
CREATE TABLE stuorgTask
(
    taskId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    FK_labelId INT UNIQUE,
    FK_ownerId INT UNIQUE,
    taskdueDate INT,
    tasksubject NVARCHAR(50),

    CONSTRAINT stuorgFK_task_label FOREIGN KEY (FK_labelId) REFERENCES stuorgTaskLabel (labelId),

    CONSTRAINT stuorgFK_task_user FOREIGN KEY (FK_ownerId) REFERENCES stuorgUser (userId),

)

-- GROUP
CREATE TABLE stuorgGroup
(
    groupId INT NOT NULL IDENTITY PRIMARY KEY UNIQUE,
    FK_userId INT UNIQUE,
    groupDescription NVARCHAR(255) NOT NULL


        CONSTRAINT stuorgFK_Group_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId)
);


--GROUP TASK
CREATE TABLE stuorgGroupTask
(
    FK_taskId INT UNIQUE,
    FK_groupId INT UNIQUE,
    FK_userId INT UNIQUE,


    CONSTRAINT stuorgFK_GroupTask_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),
    CONSTRAINT stuorgFK_GroupTask_Group FOREIGN KEY (FK_groupId) REFERENCES stuorgGroup (groupId),
    CONSTRAINT stuorgFK_GroupTask_Task FOREIGN KEY (FK_taskId) REFERENCES stuorgTask (taskId)
);

--STUORGUSERGROUP

CREATE TABLE stuorgUserGroup
(
    FK_groupId INT NOT NULL,
    FK_userId INT NOT NULL,
    CONSTRAINT PK_UserGroup PRIMARY KEY
    (
        groupId,
        userId
    ),
    FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),
    FOREIGN KEY (FK_groupId) REFERENCES stuorgUser (groupId)
);