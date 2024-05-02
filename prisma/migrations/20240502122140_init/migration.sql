-- CreateTable
CREATE TABLE "pictures" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,

    CONSTRAINT "pictures_pkey" PRIMARY KEY ("id")
);
