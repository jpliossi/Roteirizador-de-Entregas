class MotoristasController < ApplicationController
  before_action :set_motorista, only: %i[ show update destroy ]

  # GET /motoristas
  def index
    @motoristas = Motorista.all

    render json: @motoristas
  end

  # GET /motoristas/1
  def show
    render json: @motorista
  end

  # POST /motoristas
  def create
    @motorista = Motorista.new(motorista_params)

    if @motorista.save
      render json: @motorista, status: :created, location: @motorista
    else
      render json: @motorista.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /motoristas/1
  def update
    if @motorista.update(motorista_params)
      render json: @motorista
    else
      render json: @motorista.errors, status: :unprocessable_entity
    end
  end

  # DELETE /motoristas/1
  def destroy
    @motorista.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_motorista
      @motorista = Motorista.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def motorista_params
      params.require(:motorista).permit(:nome, :cpf)
    end
end
