FROM node:22-alpine

# Define o diretório de trabalho
WORKDIR /app

# Instala dependências antes de copiar o resto do código (cache)
COPY package*.json ./
RUN npm install

COPY . .

# Gera o cliente Prisma
RUN npx prisma generate

# Exponha a porta 3001 para evitar conflito com a management-api (3000)
# E a porta 5555 para o Prisma Studio
EXPOSE 3001
EXPOSE 5555

# Comando para iniciar a aplicação
CMD ["npm", "run", "dev"]
