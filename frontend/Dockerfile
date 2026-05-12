FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependências (comentado pois a pasta está vazia)
# COPY package*.json ./
# RUN npm install

# Copia o restante do código
# COPY . .

# Exponha a porta padrão do Vite/Vue
EXPOSE 5173

# Comando para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host"]
