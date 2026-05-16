class RotasController < ApplicationController
  def index
    @rotas = Rotum.where(status: "pendente")
    
    render json: @rotas.map { |r| 
      {
        id: r.id, # <--- CORREÇÃO: A vírgula salvadora estava faltando aqui!
        veiculo_id: r.veiculo_id,
        enderecosIds: r.endereco_ids, 
        km_total: r.km_total,
        tempo_previsto: r.tempo_previsto,
        status: r.status
      }
    }
  end

  def create
    @rota = Rotum.new(
      veiculo_id: params[:veiculo_id],
      endereco_ids: params[:endereco_ids], 
      km_total: params[:km_total],
      tempo_previsto: params[:tempo_previsto],
      status: "pendente"
    )

    if @rota.save
      render json: @rota, status: :created
    else
      render json: @rota.errors, status: :unprocessable_entity
    end
  end
end