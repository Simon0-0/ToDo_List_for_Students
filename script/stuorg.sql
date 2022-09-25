USE [WAD-MMD-CSD-S21_10407746]
GO

-- ALTER TABLE stuorgUserGroup
-- DROP CONSTRAINT IF EXISTS stuorgFK_UserGroup_user
-- GO
-- ALTER TABLE stuorgUserGroup
-- DROP CONSTRAINT IF EXISTS stuorgFK_UserGroup_Group
-- GO
-- DROP TABLE IF EXISTS stuorgUserGroup
-- GO

-- ALTER TABLE stuorgGroupTask
-- DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_User
-- GO
-- ALTER TABLE stuorgGroupTask
-- DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_Group
-- GO
-- ALTER TABLE stuorgGroupTask
-- DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_Task
-- GO
-- DROP TABLE IF EXISTS stuorgGroupTask
-- GO

-- ALTER TABLE stuorgGroup
-- DROP CONSTRAINT IF EXISTS stuorgFK_Group_User
-- GO
-- DROP TABLE IF EXISTS stuorgGroup
-- GO

-- ALTER TABLE stuorgTask
-- DROP CONSTRAINT IF EXISTS stuorgFK_task_label
-- GO
-- ALTER TABLE stuorgTask
-- DROP CONSTRAINT IF EXISTS stuorgFK_task_user
-- GO
-- DROP TABLE IF EXISTS stuorgTask
-- GO

-- ALTER TABLE stuorgPassword
-- DROP CONSTRAINT IF EXISTS stuorgFK_Password_Account
-- GO
-- DROP TABLE IF EXISTS stuorgPassword
-- GO

-- ALTER TABLE stuorgAccount
-- DROP CONSTRAINT IF EXISTS stuorgFK_Account_User
-- GO
-- ALTER TABLE stuorgAccount
-- DROP CONSTRAINT IF EXISTS stuorgFK_Account_Role
-- GO
-- DROP TABLE IF EXISTS stuorgAccount
-- GO

-- DROP TABLE IF EXISTS stuorgUser
-- GO

-- DROP TABLE IF EXISTS stuorgTaskLabel
-- GO

-- DROP TABLE IF EXISTS stuorgRole
-- GO

-- -- ROLE
-- CREATE TABLE stuorgRole
-- (
--     roleId INT NOT NULL IDENTITY PRIMARY KEY,
--     -- Primary key: roleid
--     roleType NVARCHAR (50) NOT NULL,
--     roleDescription NVARCHAR (255)
-- );


-- -- LABLE
-- CREATE TABLE stuorgTaskLabel
-- (
--     labelId INT NOT NULL IDENTITY PRIMARY KEY,
--     -- Primary key: labelid
--     labelName NVARCHAR (50) NOT NULL,
--     labelDescription NVARCHAR (255) NOT NULL
-- );


-- -- USER
-- CREATE TABLE stuorgUser
-- (
--     userId INT NOT NULL IDENTITY PRIMARY KEY,
--     -- Primary key: userid
--     userName NVARCHAR (50) NOT NULL,
--     email NVARCHAR (50) NOT NULL
-- );


-- -- ACCOUNT
-- CREATE TABLE stuorgAccount
-- (
--     accountId INT NOT NULL IDENTITY PRIMARY KEY,
--     -- Primary key: accountID
--     displayName NVARCHAR (50) NOT NULL,
--     accountDescription NVARCHAR (MAX),
--     FK_userId INT UNIQUE NOT NULL,
--     FK_roleId INT NOT NULL,

--     CONSTRAINT stuorgFK_Account_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),

--     CONSTRAINT stuorgFK_Account_Role FOREIGN KEY (FK_roleId) REFERENCES stuorgRole (roleId)
-- );

-- -- PASSWORD
-- CREATE TABLE stuorgPassword
-- (
--     FK_accountId INT NOT NULL UNIQUE,
--     hashedPassword NVARCHAR(255) NOT NULL,

--     CONSTRAINT stuorgFK_Password_Account FOREIGN KEY (FK_accountId) REFERENCES stuorgAccount (accountId)
-- );


-- -- TASK
-- CREATE TABLE stuorgTask
-- (
--     taskId INT NOT NULL IDENTITY PRIMARY KEY,
--     FK_labelId INT,
--     FK_userId INT,
--     taskdueDate BIGINT,
--     tasksubject NVARCHAR(255),

--     CONSTRAINT stuorgFK_task_label FOREIGN KEY (FK_labelId) REFERENCES stuorgTaskLabel (labelId),

--     CONSTRAINT stuorgFK_task_user FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId)
-- )

-- -- GROUP
-- CREATE TABLE stuorgGroup
-- (
--     groupId INT NOT NULL IDENTITY PRIMARY KEY,
--     FK_userId INT UNIQUE,
--     groupDescription NVARCHAR(255) NOT NULL,


--     CONSTRAINT stuorgFK_Group_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId)
-- );


-- --GROUP TASK
-- CREATE TABLE stuorgGroupTask
-- (
--     FK_taskId INT UNIQUE,
--     FK_groupId INT UNIQUE,
--     FK_userId INT UNIQUE,


--     CONSTRAINT stuorgFK_GroupTask_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),
--     CONSTRAINT stuorgFK_GroupTask_Group FOREIGN KEY (FK_groupId) REFERENCES stuorgGroup (groupId),
--     CONSTRAINT stuorgFK_GroupTask_Task FOREIGN KEY (FK_taskId) REFERENCES stuorgTask (taskId)
-- );

-- --STUORGUSERGROUP

-- CREATE TABLE stuorgUserGroup
-- (
--     FK_groupId INT NOT NULL,
--     FK_userId INT NOT NULL,
--     CONSTRAINT stuorgFK_UserGroup_user
--     FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),
--     CONSTRAINT stuorgFK_UserGroup_Group
--     FOREIGN KEY (FK_groupId) REFERENCES stuorgGroup (groupId)
-- );

-- INSERT INTO stuorgUser
--     ([userName], [email])
-- VALUES
--     ('John1346', 'john1346@email.com'),
--     ('Alice', 'alice_likes_potatoes@email.com'),
--     ('mothman', 'heJustTryingToWarnYou@email.com'),
--     ('LochNessMonster', 'criptid123@email.com'),
--     ('JKowalski', 'kowAlski@email.com')
-- GO

-- INSERT INTO stuorgRole
--     ([roleType], [roleDescription])
-- VALUES
--     ('admin', 'Can freely delate any account or group'),
--     ('user', 'can freely edit own account and groups')
-- GO

-- INSERT INTO stuorgAccount
--     ([displayName], [accountDescription], [FK_userId], [FK_roleId])
-- VALUES
--     ('John', 'Im a single father of four looking for love', 1, 2),
--     ('Alice', 'a huge potato fan', 2, 2),
--     ('mothman', 'Im just trying to warn you OF THE BRIDGE!!!!!!', 3, 1),
--     ('LochNessMonster', 'The real one, yes slay queen', 4, 2),
--     ('Kowalski', 'Kowalski analisys', 5, 1)
-- GO



-- -- -- -- john password: lookingFor_love
-- -- -- -- hash $2a$12$ULJSl3SbvbuAvhkenWPDk.Mo.Pgc/XxrvPnsuy2XmCOoHXpMGgsw.

-- -- -- -- alice pasword: aliceLovesPotatoes
-- -- -- -- hash $2a$12$E5.f.BTcTNSJO9q5RextN.zHo/cVZF05GB8JfLDKn2OAeAWeJQuGe

-- -- -- -- mothman password: theBRIDGEEEEEEEEEEE
-- -- -- -- hash $2a$12$1g/I0l6EDy77tlnsRhbJOuTOF5ieUT2.67sSKzB7TAV0G3FdN4dLm

-- -- -- -- lochNessMonster password: girlBO$$
-- -- -- -- hash $2a$12$v472RLlX39Hb.9KhdCAcVuASCWFca6Jfs6PQTeMAUt9zZZUq7oQN.

-- -- -- -- kowalski password: theCold_voidOFtheuniverse
-- -- -- -- hash $2a$12$kw9QbR8BK7VKiZwJTm.HeORgoTnDdC16E95A/h7N4t8b4HKRynIHq

-- INSERT INTO stuorgTaskLabel
--     ([labelName], [labelDescription])
-- VALUES
--     ('Homework', 'Tasks to do for day-to-day classes.'),
--     ('Project', 'Tasks to do for a project.'),
--     ('Assignment', 'Tasks to do for an assignment.')
-- GO

-- INSERT INTO stuorgTask
--     ([FK_labelId], [FK_userId], [tasksubject])
-- VALUES
--     (1, 1, 'Read about SQL'),
--     (2, 1, 'Install modules'),
--     (3, 1, 'Rubric: NASA'),
--     (1, 3, 'Read about SQL'),
--     (2, 3, 'Install modules'),
--     (3, 3, 'Write essay on Poland'),
--     (1, 2, 'Read about Personas'),
--     (2, 2, 'setup GET endpoint'),
--     (3, 2, 'Rubric: Contactlist'),
--     (1, 4, 'Read about colorwheel'),
--     (2, 4, 'Photoshoot with client'),
--     (3, 4, 'Create video about cold war'),
--     (1, 5, 'Read about design psychology'),
--     (2, 5, 'Poster about Node.js'),
--     (3, 5, 'Create video about cold war')
-- GO


-- INSERT INTO stuorgPassword
--     ([FK_accountId], [hashedPassword])
-- VALUES
--     (1, '$2a$12$ULJSl3SbvbuAvhkenWPDk.Mo.Pgc/XxrvPnsuy2XmCOoHXpMGgsw'),
--     (2, '$2a$12$E5.f.BTcTNSJO9q5RextN.zHo/cVZF05GB8JfLDKn2OAeAWeJQuGe'),
--     (3, '$2a$12$1g/I0l6EDy77tlnsRhbJOuTOF5ieUT2.67sSKzB7TAV0G3FdN4dLm'),
--     (4, '$2a$12$v472RLlX39Hb.9KhdCAcVuASCWFca6Jfs6PQTeMAUt9zZZUq7oQN.'),
--     (5, '$2a$12$kw9QbR8BK7VKiZwJTm.HeORgoTnDdC16E95A/h7N4t8b4HKRynIHq')
-- GO



-- SELECT *
-- FROM stuorgUser u
--     JOIN stuorgAccount a
--     ON u.userId = a.FK_userId
--     INNER JOIN stuorgPassword p
--     ON a.accountId = p.FK_accountId
-- GO

-- SELECT *
-- FROM stuorgUser u
--     JOIN stuorgAccount a
--     ON u.userId = a.FK_userId
--     JOIN stuorgRole r
--     ON a.FK_roleId = r.roleId
-- WHERE u.email = 'heJustTryingToWarnYou@email.com'
-- SELECT *
-- FROM stuorgTask
-- GO

SELECT *
FROM stuorgTask