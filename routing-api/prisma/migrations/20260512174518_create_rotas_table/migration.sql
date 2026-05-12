-- CreateTable
CREATE TABLE "rotas" (
    "id" TEXT NOT NULL,
    "veiculo_id" TEXT NOT NULL,
    "endereco_ids" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rotas_pkey" PRIMARY KEY ("id")
);
