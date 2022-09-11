USE [WAD-MMD-CSD-S21_10407746]
GO

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



-- -- john password: lookingFor_love
-- -- hash $2a$12$ULJSl3SbvbuAvhkenWPDk.Mo.Pgc/XxrvPnsuy2XmCOoHXpMGgsw.

-- -- alice pasword: aliceLovesPotatoes
-- -- hash $2a$12$E5.f.BTcTNSJO9q5RextN.zHo/cVZF05GB8JfLDKn2OAeAWeJQuGe

-- -- mothman password: theBRIDGEEEEEEEEEEE
-- -- hash $2a$12$1g/I0l6EDy77tlnsRhbJOuTOF5ieUT2.67sSKzB7TAV0G3FdN4dLm

-- -- lochNessMonster password: girlBO$$
-- -- hash $2a$12$v472RLlX39Hb.9KhdCAcVuASCWFca6Jfs6PQTeMAUt9zZZUq7oQN.

-- -- kowalski password: theCold_voidOFtheuniverse
-- -- hash $2a$12$kw9QbR8BK7VKiZwJTm.HeORgoTnDdC16E95A/h7N4t8b4HKRynIHq


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
--     JOIN stuorgPassword p
--     ON a.accountId = p.FK_accountId
-- GO

SELECT * 
FROM stuorgUser
WHERE userId = 1