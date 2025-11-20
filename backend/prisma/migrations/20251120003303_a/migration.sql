-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'WORKER', 'CUSTOMER', 'VISITOR');

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "cpf" VARCHAR(11) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VISITOR',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_email_key" ON "accounts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_cpf_key" ON "accounts"("cpf");
