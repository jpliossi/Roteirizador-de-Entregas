class AddDetailsToEnderecos < ActiveRecord::Migration[8.1]
  def change
    add_column :enderecos, :bairro, :string
  end
end
