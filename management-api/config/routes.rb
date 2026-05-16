Rails.application.routes.draw do
  resources :enderecos do
    collection do
      put :atualizar_status
    end
  end
  resources :motoristas
  resources :veiculos

  get '/rotas', to: 'rotas#index'
  post '/rotas', to: 'rotas#create'
  
  get "up" => "rails/health#show", as: :rails_health_check
end