-- CreateTable
CREATE TABLE `auditlogs` (
    `LogID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `Action` VARCHAR(255) NULL,
    `TableName` VARCHAR(100) NULL,
    `OldValue` TEXT NULL,
    `NewValue` TEXT NULL,
    `Timestamp` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`LogID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `biditems` (
    `BidItemID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `ItemName` VARCHAR(255) NOT NULL,
    `ItemDescription` TEXT NULL,
    `category` VARCHAR(255) NULL,
    `StartingPrice` DECIMAL(10, 2) NOT NULL,
    `CurrentPrice` DECIMAL(10, 2) NULL,
    `MinIncrement` DECIMAL(10, 2) NOT NULL DEFAULT 1.00,
    `BidEndTime` TIMESTAMP(0) NULL,
    `Status` ENUM('Open', 'Closed', 'Completed', 'Cancelled') NULL DEFAULT 'Open',
    `Image` BLOB NULL,

    INDEX `fk_biditems_userid`(`UserID`),
    PRIMARY KEY (`BidItemID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bids` (
    `BidID` INTEGER NOT NULL AUTO_INCREMENT,
    `BidItemID` INTEGER NULL,
    `UserID` INTEGER NULL,
    `BidAmount` DECIMAL(10, 2) NOT NULL,
    `BidTime` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Status` ENUM('Accepted', 'Rejected', 'Pending') NULL DEFAULT 'Pending',

    INDEX `BidItemID`(`BidItemID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`BidID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `loginattempts` (
    `LoginAttemptID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `IPAddress` VARCHAR(45) NULL,
    `AttemptedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `Status` ENUM('Success', 'Failed') NULL DEFAULT 'Failed',

    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`LoginAttemptID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `PaymentID` INTEGER NOT NULL AUTO_INCREMENT,
    `UserID` INTEGER NULL,
    `BidItemID` INTEGER NULL,
    `Amount` DECIMAL(10, 2) NOT NULL,
    `PaymentDate` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentStatus` ENUM('Pending', 'Completed', 'Failed', 'Refunded') NULL DEFAULT 'Pending',
    `PaymentMethod` VARCHAR(50) NOT NULL,

    INDEX `BidItemID`(`BidItemID`),
    INDEX `UserID`(`UserID`),
    PRIMARY KEY (`PaymentID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `RoleID` INTEGER NOT NULL AUTO_INCREMENT,
    `RoleName` VARCHAR(50) NOT NULL,
    `Description` TEXT NULL,

    UNIQUE INDEX `RoleName`(`RoleName`),
    PRIMARY KEY (`RoleID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `UserID` INTEGER NOT NULL AUTO_INCREMENT,
    `Username` VARCHAR(100) NOT NULL,
    `PasswordHash` VARBINARY(255) NOT NULL,
    `Salt` VARBINARY(255) NOT NULL,
    `Email` VARCHAR(150) NOT NULL,
    `FullName` VARCHAR(255) NULL,
    `RoleID` INTEGER NULL,
    `CreatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `UpdatedAt` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `users_Username_key`(`Username`),
    UNIQUE INDEX `users_Email_key`(`Email`),
    PRIMARY KEY (`UserID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
