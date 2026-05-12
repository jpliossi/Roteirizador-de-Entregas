require 'rails_helper'

RSpec.describe "Enderecos", type: :request do
  describe "POST /enderecos" do
    context "com dados inválidos" do
      it "não cria um endereço e retorna status 422" do
        post "/enderecos", params: { endereco: { rua: "" } }
        
        expect(response).to have_http_status(:unprocessable_entity)
        json_response = JSON.parse(response.body)
        expect(json_response).to have_key("rua")
      end
    end

    context "com dados válidos" do
      it "cria um endereço e retorna status 201" do
        valid_attributes = attributes_for(:endereco)
        
        expect {
          post "/enderecos", params: { endereco: valid_attributes }
        }.to change(Endereco, :count).by(1)
        
        expect(response).to have_http_status(:created)
      end
    end
  end

  describe "GET /enderecos" do
    it "retorna uma lista de endereços" do
      create_list(:endereco, 3)
      get "/enderecos"
      
      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(3)
    end
  end
end
