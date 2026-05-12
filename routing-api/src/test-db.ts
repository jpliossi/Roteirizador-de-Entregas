import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('--- Testando Conexão com o Banco ---')
  
  // 1. Criar uma rota de teste
  const novaRota = await prisma.rota.create({
    data: {
      veiculo_id: 'veiculo-teste-123',
      endereco_ids: ['end-1', 'end-2', 'end-3']
    }
  })
  console.log('✅ Rota criada com sucesso:', novaRota)

  // 2. Listar todas as rotas
  const todasAsRotas = await prisma.rota.findMany()
  console.log('📋 Todas as rotas no banco:', todasAsRotas)

  // 3. Deletar a rota de teste (limpeza)
  await prisma.rota.delete({
    where: { id: novaRota.id }
  })
  console.log('🧹 Limpeza concluída: Rota de teste removida.')
}

main()
  .catch((e) => {
    console.error('❌ Erro no teste de banco:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
