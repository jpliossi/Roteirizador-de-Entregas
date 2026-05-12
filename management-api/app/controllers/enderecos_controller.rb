class EnderecosController < ApplicationController
  # GET /enderecos
  def index
    @enderecos = Endereco.all
    render json: @enderecos
  end

  # POST /enderecos
  def create
    @endereco = Endereco.new(endereco_params)
    if @endereco.save
      render json: @endereco, status: :created
    else
      render json: @endereco.errors, status: :unprocessable_entity
    end
  end

  private

  def endereco_params
    params.require(:endereco).permit(:rua, :numero, :cidade, :estado, :cep, :latitude, :longitude, :status)
  end
end