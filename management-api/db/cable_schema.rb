# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_05_14_130810) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"
  enable_extension "pgcrypto"

  create_table "enderecos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "bairro"
    t.string "cep"
    t.string "cidade"
    t.datetime "created_at", null: false
    t.string "estado"
    t.decimal "latitude", precision: 10, scale: 6
    t.decimal "longitude", precision: 10, scale: 6
    t.string "numero"
    t.string "rua"
    t.string "status"
    t.datetime "updated_at", null: false
  end

  create_table "motoristas", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "cpf"
    t.datetime "created_at", null: false
    t.string "nome"
    t.datetime "updated_at", null: false
    t.index ["cpf"], name: "index_motoristas_on_cpf", unique: true
  end

  create_table "solid_cable_messages", force: :cascade do |t|
    t.binary "channel", null: false
    t.bigint "channel_hash", null: false
    t.datetime "created_at", null: false
    t.binary "payload", null: false
    t.index ["channel"], name: "index_solid_cable_messages_on_channel"
    t.index ["channel_hash"], name: "index_solid_cable_messages_on_channel_hash"
    t.index ["created_at"], name: "index_solid_cable_messages_on_created_at"
  end

  create_table "veiculos", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.integer "capacidade"
    t.datetime "created_at", null: false
    t.string "modelo"
    t.uuid "motorista_id"
    t.string "placa"
    t.string "status"
    t.datetime "updated_at", null: false
  end
end
