-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('Admin', 'Customer', 'Analyst');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password" CHAR(50) NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "forgotPasswordToken" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'Analyst',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."profiles" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_userId_key" ON "public"."profiles"("userId");

-- AddForeignKey
ALTER TABLE "public"."profiles" ADD CONSTRAINT "profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
