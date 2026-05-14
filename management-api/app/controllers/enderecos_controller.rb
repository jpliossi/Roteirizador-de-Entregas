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

  # PUT /enderecos/atualizar_status
  def atualizar_status
    if params[:endereco_ids].blank?
      return render json: { error: "endereco_ids não fornecidos" }, status: :bad_request
    end

    Endereco.where(id: params[:endereco_ids]).update_all(status: "em rota")
    render json: { message: "Status atualizado com sucesso" }, status: :ok
  end

  private

  def endereco_params
    params.require(:endereco).permit(
      :status, :veiculo_id, :rua, :numero, :bairro, 
      :cidade, :estado, :cep, :latitude, :longitude)
  end
end