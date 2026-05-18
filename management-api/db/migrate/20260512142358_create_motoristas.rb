class CreateMotoristas < ActiveRecord::Migration[8.1]
  def change
    create_table :motoristas, id: :uuid do |t|
      t.string :nome
      t.string :cpf

      t.timestamps
    end
    add_index :motoristas, :cpf, unique: true
  end
end
