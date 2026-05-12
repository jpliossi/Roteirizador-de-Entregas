class Endereco < ApplicationRecord
  # Define status como enum para facilitar consultas e integridade
  enum :status, {
    pendente: "pendente",
    em_rota: "em_rota",
    entregue: "entregue"
  }, default: :pendente

  # Validações de presença
  validates :rua, :cidade, :estado, :latitude, :longitude, :status, presence: true

  # Latitude e Longitude devem ser numéricos
  validates :latitude, numericality: true
  validates :longitude, numericality: true
end