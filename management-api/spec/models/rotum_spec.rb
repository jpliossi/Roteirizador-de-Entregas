require 'rails_helper'

RSpec.describe Rotum, type: :model do
  describe "Validações" do
    it "é válido com atributos obrigatórios" do
      rota = build(:rotum, veiculo_id: "VEIC-123", km_total: 15.5, status: "pendente")
      expect(rota).to be_valid
    end

    it "é inválido sem veiculo_id" do
      rota = build(:rotum, veiculo_id: nil)
      expect(rota).not_to be_valid
    end

    it "é inválido com km_total negativo" do
      rota = build(:rotum, km_total: -1)
      expect(rota).not_to be_valid
    end
  end
end
