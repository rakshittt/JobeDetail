/*
  Warnings:

  - A unique constraint covering the columns `[razorpayPlanId]` on the table `plans` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "plans_razorpayPlanId_key" ON "plans"("razorpayPlanId");
