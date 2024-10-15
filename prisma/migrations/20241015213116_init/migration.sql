CREATE TABLE auditlogs (
    LogID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Action VARCHAR(255),
    TableName VARCHAR(100),
    OldValue TEXT,
    NewValue TEXT,
    Timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX UserID_idx (UserID)
);

CREATE TABLE biditems (
    BidItemID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    ItemName VARCHAR(255) NOT NULL,
    ItemDescription TEXT,
    category VARCHAR(255),
    StartingPrice DECIMAL(10, 2) NOT NULL,
    CurrentPrice DECIMAL(10, 2),
    MinIncrement DECIMAL(10, 2) DEFAULT 1.00,
    BidEndTime TIMESTAMP,
    Status ENUM('Open', 'Closed', 'Completed', 'Cancelled') DEFAULT 'Open',
    Image BLOB,
    INDEX fk_biditems_userid_idx (UserID)
);

CREATE TABLE bids (
    BidID INT AUTO_INCREMENT PRIMARY KEY,
    BidItemID INT,
    UserID INT,
    BidAmount DECIMAL(10, 2) NOT NULL,
    BidTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Accepted', 'Rejected', 'Pending') DEFAULT 'Pending',
    INDEX BidItemID_idx (BidItemID),
    INDEX UserID_idx (UserID)
);

CREATE TABLE loginattempts (
    LoginAttemptID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    IPAddress VARCHAR(45),
    AttemptedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Status ENUM('Success', 'Failed') DEFAULT 'Failed',
    INDEX UserID_idx (UserID)
);

CREATE TABLE payments (
    PaymentID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    BidItemID INT,
    Amount DECIMAL(10, 2) NOT NULL,
    PaymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PaymentStatus ENUM('Pending', 'Completed', 'Failed', 'Refunded') DEFAULT 'Pending',
    PaymentMethod VARCHAR(50) NOT NULL,
    INDEX BidItemID_idx (BidItemID),
    INDEX UserID_idx (UserID)
);

CREATE TABLE roles (
    RoleID INT AUTO_INCREMENT PRIMARY KEY,
    RoleName VARCHAR(50) UNIQUE,
    Description TEXT
);

CREATE TABLE users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(100) UNIQUE NOT NULL,
    PasswordHash VARBINARY(255) NOT NULL,
    Salt VARBINARY(255) NOT NULL,
    Email VARCHAR(150) UNIQUE NOT NULL,
    IsVerified BOOLEAN DEFAULT FALSE,
    IsTwoFactorEnabled BOOLEAN DEFAULT FALSE,
    FullName VARCHAR(255),
    RoleID INT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TwoFactorToken (
    id VARCHAR(150) PRIMARY KEY DEFAULT UUID(),
    token VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Expires TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (Email, token)
);

CREATE TABLE TwoFactorConfirmation (
    id VARCHAR(150) PRIMARY KEY DEFAULT UUID(),
    userId INT UNIQUE NOT NULL,
    CONSTRAINT fk_twofactorconfirmation_user FOREIGN KEY (userId) REFERENCES users(UserID) ON DELETE CASCADE
);

CREATE TABLE VerificationToken (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Expires TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (Email, token)
);
