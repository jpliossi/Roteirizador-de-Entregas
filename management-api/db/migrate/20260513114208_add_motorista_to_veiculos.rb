class AddMotoristaToVeiculos < ActiveRecord::Migration[8.1]
  def change
    add_column :veiculos, :motorista_id, :uuid
  end
end
