FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Exponha a porta padrão do Vite/Vue
EXPOSE 5174

# Comando para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5174"]
