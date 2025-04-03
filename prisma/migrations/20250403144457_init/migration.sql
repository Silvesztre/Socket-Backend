-- CreateTable
CREATE TABLE "User" (
    "userId" UUID NOT NULL,
    "email" VARCHAR(72) NOT NULL,
    "password" VARCHAR(72) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
