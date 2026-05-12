FROM node:18-alpine

# Define o diretório de trabalho
WORKDIR /app
CMD ["tail", "-f", "/dev/null"]
# Exponha a porta 3001 para evitar conflito com a management-api (3000)
EXPOSE 3001

# Comando para iniciar a aplicação
# CMD ["npm", "start"]
