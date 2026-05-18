# db/seeds.rb
#1. Limpando os dados existentes para evitar duplicações
puts "Limpando dados antigos..."
Rotum.destroy_all
Endereco.destroy_all
Veiculo.destroy_all
Motorista.destroy_all

# 2. Criando Veículos de Teste (IDs gerados pelo banco)
puts "Criando veículos..."
veiculo_caminhao = Veiculo.create!(
  modelo: "Caminhão Mercedes-Benz Accelo",
  placa: "HPR-4020",
  status: "disponivel",
  capacidade: 5000
)

veiculo_fiorino = Veiculo.create!(
  modelo: "Fiat Fiorino Endurance",
  placa: "QAB-2026",
  status: "disponivel",
  capacidade: 650,
)

veiculo_moto = Veiculo.create!(
  modelo: "Honda Cargo 160",
  placa: "REZ-9A88",
  status: "disponivel",
  capacidade: 40
)

# 3. Criando Endereços de Teste (baseados em Campo Grande - MS)
endereco_1 = Endereco.create!(
  rua: "Rua Uricuri",
  numero: "248",
  bairro: "Vila Olinda",
  cidade: "Campo Grande",
  estado: "MS", 
  cep: "79060-040",
  latitude: -20.5186, 
  longitude: -54.6012,
  status: "pendente",
  veiculo_id: nil
)

endereco_2 = Endereco.create!(
  rua: "Rua Aristóteles",
  numero: "549",
  bairro: "Vila Progresso",
  cidade: "Campo Grande",
  estado: "MS",
  cep: "79080-360",
  latitude: -20.4903,
  longitude: -54.6130,
  status: "pendente",
  veiculo_id: nil
)

endereco_3 = Endereco.create!(
  rua: "Avenida Afonso Pena",
  numero: "4900",
  bairro: "Santa Fé",
  cidade: "Campo Grande",
  estado: "MS",
  cep: "79020-001",
  latitude: -20.4561,
  longitude: -54.5902,
  status: "pendente",
  veiculo_id: nil
)

endereco_4 = Endereco.create!(
  rua: "Rua 14 de Julho",
  numero: "1944",
  bairro: "Centro",
  cidade: "Campo Grande",
  estado: "MS",
  cep: "79002-333",
  latitude: -20.4623,
  longitude: -54.6164,
  status: "pendente",
  veiculo_id: nil
)

# 4. Criando Motoristas de Teste (IDs gerados pelo banco)
puts "Criando motoristas..."
motorista_1 = Motorista.create!(
  nome: "Marcos da Silva",
  cpf: "12345678900"
)

motorista_2 = Motorista.create!(
  nome: "Ana Beatriz Souza",
  cpf: "98765432111"
)