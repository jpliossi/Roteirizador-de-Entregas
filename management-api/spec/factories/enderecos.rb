FactoryBot.define do
  factory :endereco do
    rua { Faker::Address.street_name }
    numero { Faker::Address.building_number }
    cidade { Faker::Address.city }
    estado { Faker::Address.state_abbr }
    cep { Faker::Address.zip_code }
    latitude { Faker::Address.latitude }
    longitude { Faker::Address.longitude }
    status { "pendente" }
  end
end
