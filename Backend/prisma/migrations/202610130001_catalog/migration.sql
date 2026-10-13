-- CreateTable
CREATE TABLE `Branch` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `name` VARCHAR(120) NOT NULL,
    `timezone` VARCHAR(64) NOT NULL,
    `address` VARCHAR(255) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Branch_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(80) NOT NULL,
    `name` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `Category_slug_key`(`slug`),
    UNIQUE INDEX `Category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(160) NOT NULL,
    `vin` VARCHAR(17) NOT NULL,
    `registrationNumber` VARCHAR(32) NOT NULL,
    `make` VARCHAR(80) NOT NULL,
    `model` VARCHAR(80) NOT NULL,
    `modelYear` SMALLINT UNSIGNED NOT NULL,
    `seats` TINYINT UNSIGNED NOT NULL,
    `transmission` ENUM('AUTOMATIC', 'MANUAL') NOT NULL,
    `fuelType` ENUM('PETROL', 'DIESEL', 'HYBRID', 'ELECTRIC') NOT NULL,
    `status` ENUM('ACTIVE', 'MAINTENANCE', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
    `baseDailyMinor` BIGINT UNSIGNED NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `branchId` CHAR(36) NOT NULL,
    `categoryId` CHAR(36) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehicle_slug_key`(`slug`),
    UNIQUE INDEX `Vehicle_vin_key`(`vin`),
    UNIQUE INDEX `Vehicle_registrationNumber_key`(`registrationNumber`),
    INDEX `Vehicle_status_branchId_categoryId_idx`(`status`, `branchId`, `categoryId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VehicleImage` (
    `id` CHAR(36) NOT NULL,
    `vehicleId` CHAR(36) NOT NULL,
    `url` VARCHAR(512) NOT NULL,
    `altText` VARCHAR(255) NOT NULL,
    `sortOrder` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    INDEX `VehicleImage_vehicleId_sortOrder_idx`(`vehicleId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_branchId_fkey` FOREIGN KEY (`branchId`) REFERENCES `Branch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `Category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VehicleImage` ADD CONSTRAINT `VehicleImage_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `Vehicle`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
