class Veiculo < ApplicationRecord
  belongs_to :motorista, optional: true
  validates :placa, :capacidade, :modelo, presence: true
  validates :placa, uniqueness: true
  
  # Opcional: Garantir que a capacidade seja positiva
  validates :capacidade, numericality: { greater_than: 0 }
end
