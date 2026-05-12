class CreateEnderecos < ActiveRecord::Migration[8.0]
  def change
    create_table :enderecos, id: :uuid do |t|
      t.string :rua
      t.string :numero
      t.string :cidade
      t.string :estado
      t.string :cep
      t.decimal :latitude, precision: 10, scale: 6
      t.decimal :longitude, precision: 10, scale: 6
      t.string :status

      t.timestamps
    end
  end
end