class Rotum < ApplicationRecord
  # Garante que o campo de texto seja tratado nativamente como uma Array/JSON
  serialize :endereco_ids, coder: JSON

  validates :veiculo_id, :endereco_ids, :km_total, :tempo_previsto, presence: true
end
