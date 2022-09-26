<<<<<<< Updated upstream
USE [WAD-MMD-CSD-S21_10407746]
GO

ALTER TABLE stuorgUserGroup
DROP CONSTRAINT IF EXISTS stuorgFK_UserGroup_user
GO
ALTER TABLE stuorgUserGroup
DROP CONSTRAINT IF EXISTS stuorgFK_UserGroup_Group
GO
DROP TABLE IF EXISTS stuorgUserGroup
GO

ALTER TABLE stuorgGroupTask
DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_User
GO
ALTER TABLE stuorgGroupTask
DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_Group
GO
ALTER TABLE stuorgGroupTask
DROP CONSTRAINT IF EXISTS stuorgFK_GroupTask_Task
GO
DROP TABLE IF EXISTS stuorgGroupTask
GO

ALTER TABLE stuorgGroup
DROP CONSTRAINT IF EXISTS stuorgFK_Group_User
GO
DROP TABLE IF EXISTS stuorgGroup
GO

ALTER TABLE stuorgTask
DROP CONSTRAINT IF EXISTS stuorgFK_task_label
GO
ALTER TABLE stuorgTask
DROP CONSTRAINT IF EXISTS stuorgFK_task_user
GO
DROP TABLE IF EXISTS stuorgTask
GO

ALTER TABLE stuorgPassword
DROP CONSTRAINT IF EXISTS stuorgFK_Password_Account
GO
DROP TABLE IF EXISTS stuorgPassword
GO

ALTER TABLE stuorgAccount
DROP CONSTRAINT IF EXISTS stuorgFK_Account_User
GO
ALTER TABLE stuorgAccount
DROP CONSTRAINT IF EXISTS stuorgFK_Account_Role
GO
DROP TABLE IF EXISTS stuorgAccount
GO

DROP TABLE IF EXISTS stuorgUser
GO

DROP TABLE IF EXISTS stuorgTaskLabel
GO

DROP TABLE IF EXISTS stuorgRole
GO

-- ROLE
CREATE TABLE stuorgRole
(
    roleId INT NOT NULL IDENTITY PRIMARY KEY,
    -- Primary key: roleid
    roleType NVARCHAR (50) NOT NULL,
    roleDescription NVARCHAR (255)
);


-- LABLE
CREATE TABLE stuorgTaskLabel
(
    labelId INT NOT NULL IDENTITY PRIMARY KEY,
    labelName NVARCHAR (50) NOT NULL,
    labelDescription NVARCHAR (255) NOT NULL
);
-- USER
CREATE TABLE stuorgUser
(
    userId INT NOT NULL IDENTITY PRIMARY KEY,
    -- Primary key: userid
    userName NVARCHAR (50) NOT NULL,
    email NVARCHAR (50) NOT NULL
);


-- ACCOUNT
CREATE TABLE stuorgAccount
(
    accountId INT NOT NULL IDENTITY PRIMARY KEY,
    -- Primary key: accountID
    displayName NVARCHAR (50) NOT NULL,
    accountDescription NVARCHAR (MAX),
    FK_userId INT UNIQUE NOT NULL,
    FK_roleId INT NOT NULL,

    CONSTRAINT stuorgFK_Account_User FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),

    CONSTRAINT stuorgFK_Account_Role FOREIGN KEY (FK_roleId) REFERENCES stuorgRole (roleId)
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
    taskId INT NOT NULL IDENTITY PRIMARY KEY,
    FK_labelId INT,
    FK_userId INT,
    taskdueDate BIGINT,
    tasksubject NVARCHAR(255),

    CONSTRAINT stuorgFK_task_label FOREIGN KEY (FK_labelId) REFERENCES stuorgTaskLabel (labelId),

    CONSTRAINT stuorgFK_task_user FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId)
)

-- GROUP
CREATE TABLE stuorgGroup
(
    groupId INT NOT NULL IDENTITY PRIMARY KEY,
    FK_userId INT,
    groupName NVARCHAR(255) NOT NULL,
    groupDescription NVARCHAR(255) NOT NULL,


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
    CONSTRAINT stuorgFK_UserGroup_user
    FOREIGN KEY (FK_userId) REFERENCES stuorgUser (userId),
    CONSTRAINT stuorgFK_UserGroup_Group
    FOREIGN KEY (FK_groupId) REFERENCES stuorgGroup (groupId)
);

INSERT INTO stuorgUser
    ([userName], [email])
VALUES
    ('John1346', 'john1346@email.com'),
    ('Alice', 'alice_likes_potatoes@email.com'),
    ('mothman', 'heJustTryingToWarnYou@email.com'),
    ('LochNessMonster', 'criptid123@email.com'),
    ('Dracula', 'theVampire@666.com'),
    ('Victor Frankenstein', 'doctor123@666.com'),
    ('Kowalski', 'kowAlski@email.com'),
    ('Dwight Schrute', 'DwightSchrute@dundermifflin.com'),
    ('Michael Scott', 'MichaelScott@dundermifflin.com'),
    ('Jim Halpert', 'JimHalpert@dundermifflin.com'),
    ('Gin-san', 'sakata_gintoki@edo.com'),
    ('Shinpachi-kun', 'shimura_shinpachi@edo.com'),
    ('Kagura-chan', 'kagura@edo.com'),
    ('Sadaharu', 'sadaharu@edo.com')
GO

INSERT INTO stuorgRole
    ([roleType], [roleDescription])
VALUES
    ('admin', 'Can freely delate any account or group'),
    ('user', 'can freely edit own account and groups')
GO

INSERT INTO stuorgAccount
    ([displayName], [accountDescription], [FK_userId], [FK_roleId])
VALUES
    ('John', 'Im a single father of four looking for love', 1, 2),
    ('Alice', 'a huge potato fan', 2, 2),
    ('mothman', 'Im just trying to warn you OF THE BRIDGE!!!!!!', 3, 1),
    ('LochNessMonster', 'The real one, yes slay queen', 4, 2),
    ('Dracula', 'I saw. Dracula. With red light of triumph in his eyes, and with a smile that Judas in hell might be proud of.', 5, 1),
    ('Victor Frankenstein', 'a scientist obsessed with the combination of alchemy and chemistry in relation to dead organisms. After trial and error, and quite a bit of grave robbing, I managed to animate a creature of his my making...', 6, 2),
    ('Kowalski', 'Kowalski analisys', 7, 2),
    ('Dwight Schrute', '	Whenever Im about to do something, I think, "Would an idiot do that?" And if they would, I do not do that thing.', 8, 2),
    ('Michael Scott', 'Thats What She Said', 9, 2),
    ('Jim Halpert', 'Right now, this is just a job. If I advance any higher, this would be my career. And if this were my career, Id have to throw myself in front of a train.', 10, 2),
    ('Gin-san', 'White Devil', 11, 1),
    ('Shinpachi-kun', ' Shinpachis glasses make out 95% of him and they are more Shinpachi than Shinpachi himself, with the rest being 3% water and 2% garbage', 12, 2),
    ('Kagura-chan', 'Showing us such a disgusting thing... What the hell am I gonna do if I cant sleep, you Bastard?!', 13, 2),
    ('Sadaharu', '"ARF!" *Translate: Thank You', 14, 2)
GO

INSERT INTO stuorgPassword
    ([FK_accountId], [hashedPassword])
VALUES
    (1, '$2a$12$ULJSl3SbvbuAvhkenWPDk.Mo.Pgc/XxrvPnsuy2XmCOoHXpMGgsw.'),
    (2, '$2a$12$E5.f.BTcTNSJO9q5RextN.zHo/cVZF05GB8JfLDKn2OAeAWeJQuGe'),
    -- aliceLovesPotatoes
    (3, '$2a$12$1g/I0l6EDy77tlnsRhbJOuTOF5ieUT2.67sSKzB7TAV0G3FdN4dLm'),
    -- theBRIDGEEEEEEEEEEE
    (4, '$2a$12$v472RLlX39Hb.9KhdCAcVuASCWFca6Jfs6PQTeMAUt9zZZUq7oQN.'),
    (5, '$2a$13$oXK/HgRDKIb8aYwfhB6dc.YnqCaLLr3Gfrgd4EaSL9ftD33Jw5zAK'),
    -- bloodboodBLOOD
    (6, '$2a$13$5Ic17gxOIwvK.uXMlFs3AuvagCF6Il322709SYEdyMwBJDzQHcCAu'),
    -- madFuckingDog
    (7, '$2a$12$kw9QbR8BK7VKiZwJTm.HeORgoTnDdC16E95A/h7N4t8b4HKRynIHq'),
    -- theCold_voidOFtheuniverse
    (8, '$2a$13$YwNqqhw7eeBlOJDXN95gleCsmEZqs9r5auLzVOTvHQoREoxR2/89a'),
    -- boobleDoll
    (9, '$2a$13$kofN6vP2xFw3JOWFja.JdemqzakYOHhOmtx0RKGBZdcoUuLQQuEWu'),
    -- freshMadeBacon
    (10, '$2a$13$uxsypAvCJ7mT7sBHSpVrsOXqYcp4CgR4ITrxg.GPfTXAWm2JeSoPm'),
    -- beeboobaabaabaa
    (11, '$2a$13$/gPPePuMIhFXqXkXUnPZeOS11hQgUR5rIlUiZooPtPFAs9RkDNyum'),
    -- strawberry_milk
    (12, '$2a$13$0VSncOqYCIy2kFgUQ/yqMeM1kXlBfsKGQREMgDhfSUzc4MhUSbsBq'),
    -- glasses_101
    (13, '$2a$13$PA.ZEDbLYpUukIX4r290COu9sLPOAHm6GgVrQh6N60c7YULCS00We'),
    -- eggRice
    (14, '$2a$13$42jTT1iiGyVp7Dnhf9Hic.jpz13NbUp8A9kXWOhPZQJ7yycvim1XO')
    -- arfarfARFARF
GO

INSERT INTO stuorgTaskLabel
    ( [labelName], [labelDescription])
VALUES
    ('homework', 'short term task related to sinular learning material'),
    ('project', 'long term project with unique outcome and purpose'),
    ('assigment', 'a task without specfic constrains')
GO

-- INSERT INTO stuorgTask
--     ( [FK_labelId], [FK_userId], [taskdueDate], [tasksubject])
-- VALUES
--     (1, 1, , 'definet'),
-- GO



SELECT *
FROM stuorgUser u
    JOIN stuorgAccount a
    ON u.userId = a.FK_userId
    INNER JOIN stuorgPassword p
    ON a.accountId = p.FK_accountId
GO

SELECT *
FROM stuorgUser u
    JOIN stuorgAccount a
    ON u.userId = a.FK_userId
    JOIN stuorgRole r
    ON a.FK_roleId = r.roleId
WHERE u.email = 'heJustTryingToWarnYou@email.com'


SELECT *
FROM stuorgTask
GO



SELECT *
FROM stuorgGroup


SELECT *
FROM stuorgAccount


SELECT *
FROM stuorgUser

SELECT *
FROM stuorgUser u
    JOIN stuorgAccount a
    ON u.userId = a.FK_userId
    JOIN stuorgPassword p
    ON a.accountId= p.FK_accountId
WHERE u.userId = 8


=======
>>>>>>> Stashed changes

