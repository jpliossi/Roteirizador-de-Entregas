class CreateRota < ActiveRecord::Migration[8.1]
  def change
    create_table :rota, id: :uuid do |t|
      t.string :veiculo_id
      t.text :endereco_ids
      t.float :km_total
      t.integer :tempo_previsto
      t.string :status

      t.timestamps
    end
  end
end
