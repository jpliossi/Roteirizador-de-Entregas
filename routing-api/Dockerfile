FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências (comentado pois a pasta está vazia)
# COPY package*.json ./
# RUN npm install

# Copia o restante do código
# COPY . .

# Exponha a porta 3001 para evitar conflito com a management-api (3000)
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["npm", "start"]
