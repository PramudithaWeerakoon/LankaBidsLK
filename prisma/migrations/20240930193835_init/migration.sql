-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(191) NOT NULL,
    `PasswordHash` LONGBLOB NOT NULL,
    `Salt` LONGBLOB NOT NULL,
    `Email` VARCHAR(191) NOT NULL,
    `FullName` VARCHAR(191) NULL,
    `RoleID` INTEGER NULL,
    `CreatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_Username_key`(`Username`),
    UNIQUE INDEX `users_Email_key`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
