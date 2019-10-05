FROM node:lts-alpine

# installe un simple serveur http pour servir un contenu statique
# définit le dossier 'app' comme dossier de travail
WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

# copie 'package.json'
COPY package.json .

# installe les dépendances du projet
RUN npm install

RUN apk add --no-cache tzdata

ENV TZ Europe/Paris

# copie les fichiers et dossiers du projet dans le dossier de travail (par exemple : le dossier 'app')
COPY . .

EXPOSE 8080
ENTRYPOINT [ "npm", "run", "serve" ]
