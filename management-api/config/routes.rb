Rails.application.routes.draw do
  resources :enderecos do
    collection do
      put :atualizar_status
    end
  end
  resources :motoristas
  resources :veiculos
  get "up" => "rails/health#show", as: :rails_health_check
end