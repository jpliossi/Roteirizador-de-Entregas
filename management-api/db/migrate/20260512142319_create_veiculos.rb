class CreateVeiculos < ActiveRecord::Migration[8.1]
  def change
    create_table :veiculos, id: :uuid do |t|
      t.string :placa
      t.integer :capacidade
      t.string :modelo
      t.string :status

      t.timestamps
    end
  end
end
