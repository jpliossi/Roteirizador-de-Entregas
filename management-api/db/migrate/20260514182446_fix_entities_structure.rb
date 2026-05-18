class FixEntitiesStructure < ActiveRecord::Migration[8.1]
  def change
    # Garante que enderecos tenha veiculo_id (UUID)
    unless column_exists?(:enderecos, :veiculo_id)
      add_column :enderecos, :veiculo_id, :uuid
    end

    # Garante que veiculos tenha status
    unless column_exists?(:veiculos, :status)
      add_column :veiculos, :status, :string, default: 'disponivel'
    end
    
    # Adiciona índices para performance
    add_index :enderecos, :veiculo_id unless index_exists?(:enderecos, :veiculo_id)
    add_index :veiculos, :status unless index_exists?(:veiculos, :status)
  end
end
