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

  #delete /enderecos/:id
  def destroy
    @endereco = Endereco.find(params[:id])
    @endereco.destroy! 
    
    head :no_content
  end

  # PUT /enderecos/atualizar_status
  def atualizar_status
    if params[:concluir]
      # 1. Marca como entregue E limpa o veiculo_id (ESSENCIAL)
      Endereco.where(veiculo_id: params[:veiculo_id], status: "em rota")
              .update_all(status: "entregue", veiculo_id: nil)
      
      # 2. Libera o veículo
      Veiculo.find(params[:veiculo_id]).update(status: "disponivel")
      
      return render json: { message: "Veículo liberado!" }, status: :ok
    end

    if params[:endereco_ids].blank?
      return render json: { error: "endereco_ids não fornecidos" }, status: :bad_request
    end

    puts "PARAMETROS RECEBIDOS: #{params.inspect}"

    # Atualiza endereços: status "em rota" e vincula ao veículo
    Endereco.where(id: params[:endereco_ids]).update_all(
      status: "em rota", 
      veiculo_id: params[:veiculo_id].to_s
    )

    # Atualiza o status do veículo para "em rota" se o veiculo_id for fornecido
    if params[:veiculo_id].present?
      Veiculo.find(params[:veiculo_id]).update(status: "em rota")
    end

    render json: { message: "Status atualizado com sucesso" }, status: :ok
  end

  private

  def endereco_params
    params.require(:endereco).permit(
      :status, :veiculo_id, :rua, :numero, :bairro, 
      :cidade, :estado, :cep, :latitude, :longitude)
  end
end