require "test_helper"

class VeiculosControllerTest < ActionDispatch::IntegrationTest
  setup do
    @veiculo = veiculos(:one)
  end

  test "should get index" do
    get veiculos_url, as: :json
    assert_response :success
  end

  test "should create veiculo" do
    assert_difference("Veiculo.count") do
      post veiculos_url, params: { veiculo: { capacidade: @veiculo.capacidade, modelo: @veiculo.modelo, placa: @veiculo.placa, status: @veiculo.status } }, as: :json
    end

    assert_response :created
  end

  test "should show veiculo" do
    get veiculo_url(@veiculo), as: :json
    assert_response :success
  end

  test "should update veiculo" do
    patch veiculo_url(@veiculo), params: { veiculo: { capacidade: @veiculo.capacidade, modelo: @veiculo.modelo, placa: @veiculo.placa, status: @veiculo.status } }, as: :json
    assert_response :success
  end

  test "should destroy veiculo" do
    assert_difference("Veiculo.count", -1) do
      delete veiculo_url(@veiculo), as: :json
    end

    assert_response :no_content
  end
end
