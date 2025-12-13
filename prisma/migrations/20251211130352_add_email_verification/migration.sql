-- CreateTable
CREATE TABLE "tblEmailVerificationTokens" (
    "tokenId" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tblEmailVerificationTokens_pkey" PRIMARY KEY ("tokenId")
);

-- CreateIndex
CREATE UNIQUE INDEX "tblEmailVerificationTokens_token_key" ON "tblEmailVerificationTokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "tblEmailVerificationTokens_email_accountType_key" ON "tblEmailVerificationTokens"("email", "accountType");
