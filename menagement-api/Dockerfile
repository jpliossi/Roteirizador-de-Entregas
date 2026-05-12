FROM ruby:3.2.2

# Instala dependências do sistema
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs

# Define o diretório de trabalho
WORKDIR /app

# Copia o Gemfile e o Gemfile.lock para o contêiner
COPY Gemfile Gemfile.lock ./
# Instala as gems
RUN bundle install
# Copia o restante do código da aplicação para o contêiner
COPY . .

# Exponha a porta 3000
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["rails", "server", "-b", "0.0.0.0"]
