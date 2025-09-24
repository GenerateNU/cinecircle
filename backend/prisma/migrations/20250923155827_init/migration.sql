-- CreateTable
CREATE TABLE "public"."bootcamp" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "fav_food" JSON,

    CONSTRAINT "bootcamp_pkey" PRIMARY KEY ("id")
);
