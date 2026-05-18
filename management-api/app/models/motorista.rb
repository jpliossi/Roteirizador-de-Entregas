class Motorista < ApplicationRecord
  has_one :veiculo, dependent: :nullify
  validates :nome, :cpf, presence: true
  validates :cpf, uniqueness: true
  validates :cpf, format: { with: /\A\d{11}\z/, message: "deve conter 11 dígitos numéricos" }
end