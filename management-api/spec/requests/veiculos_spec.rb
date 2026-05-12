require 'rails_helper'

RSpec.describe "Veiculos", type: :request do
  describe "GET /veiculos/:id" do
    context "quando o veículo não existe" do
      it "retorna status 404 Not Found" do
        get "/veiculos/00000000-0000-0000-0000-000000000000"
        
        expect(response).to have_http_status(:not_found)
      end
    end
  end
end
