class RotasController < ApplicationController
  # GET /rotas - Alimenta o painel ao dar F5
  def index
    @rotas = Rotum.all

    render json: @rotas.map { |r|
      id_do_carro = r.respond_to?(:veiculo_id) ? r.veiculo_id : (r.respond_to?(:vehicle_id) ? r.vehicle_id : nil)
      id_do_carro ||= r.attributes["veiculo_id"] || r.attributes["vehicle_id"]

      veiculo = Veiculo.find_by(id: id_do_carro)

      enderecos_ids_array = r.respond_to?(:endereco_ids) ? r.endereco_ids : (r.respond_to?(:enderecos_ids) ? r.enderecos_ids : [])
      enderecos_banco = Endereco.where(id: enderecos_ids_array).index_by(&:id)
      enderecos_ordenados = enderecos_ids_array.map { |id| enderecos_banco[id] }.compact

      {
        id: r.id,
        veiculo_id: id_do_carro.to_s,
        placa: veiculo&.placa || "Sem Veículo",
        km_total: r.respond_to?(:km_total) ? r.km_total : (r.attributes["km_total"] || 0),
        tempo_previsto: r.respond_to?(:tempo_previsto) ? r.tempo_previsto : (r.attributes["tempo_previsto"] || 0),
        status: r.status,
        enderecos_relacionados: enderecos_ordenados.map { |e| 
          { id: e.id, rua: e.rua, numero: e.numero, bairro: e.bairro }
        }
      }
    }
  end

  # POST /rotas - Cria a rota e já devolve o itinerário completo e populado
  def create
    @rota = Rotum.new(
      veiculo_id: params[:veiculo_id],
      endereco_ids: params[:endereco_ids], 
      km_total: params[:km_total],
      tempo_previsto: params[:tempo_previsto],
      status: "pendente"
    )

    if @rota.save
      veiculo = Veiculo.find_by(id: @rota.veiculo_id)

      # Resgata e ordena os endereços REAIS enviados, igualzinho fazemos no index
      enderecos_ids_array = @rota.respond_to?(:endereco_ids) ? @rota.endereco_ids : (@rota.respond_to?(:enderecos_ids) ? @rota.enderecos_ids : [])
      enderecos_banco = Endereco.where(id: enderecos_ids_array).index_by(&:id)
      enderecos_ordenados = enderecos_ids_array.map { |id| enderecos_banco[id] }.compact

      resposta_formatada = {
        id: @rota.id,
        veiculo_id: @rota.veiculo_id.to_s,
        placa: veiculo&.placa || "Sem Veículo",
        km_total: (@rota.km_total || 0).to_f,
        tempo_previsto: (@rota.tempo_previsto || 0).to_f,
        status: @rota.status,
        # 🎯 AGORA VAI PREENCHIDO: O Vue não vai mais receber uma rota vazia ou quebrar o contrato
        enderecos_relacionados: enderecos_ordenados.map { |e| 
          { id: e.id, rua: e.rua, numero: e.numero, bairro: e.bairro }
        }
      }

      render json: resposta_formatada, status: :created
    else
      render json: @rota.errors, status: :unprocessable_entity
    end
  rescue => e
    render json: { error: e.message }, status: :unprocessable_entity
  end
end