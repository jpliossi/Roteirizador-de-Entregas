require "test_helper"

class MotoristaControllerTest < ActionDispatch::IntegrationTest
  setup do
    @motoristum = motorista(:one)
  end

  test "should get index" do
    get motorista_url, as: :json
    assert_response :success
  end

  test "should create motoristum" do
    assert_difference("Motoristum.count") do
      post motorista_url, params: { motoristum: { cpf: @motoristum.cpf, nome: @motoristum.nome } }, as: :json
    end

    assert_response :created
  end

  test "should show motoristum" do
    get motoristum_url(@motoristum), as: :json
    assert_response :success
  end

  test "should update motoristum" do
    patch motoristum_url(@motoristum), params: { motoristum: { cpf: @motoristum.cpf, nome: @motoristum.nome } }, as: :json
    assert_response :success
  end

  test "should destroy motoristum" do
    assert_difference("Motoristum.count", -1) do
      delete motoristum_url(@motoristum), as: :json
    end

    assert_response :no_content
  end
end
