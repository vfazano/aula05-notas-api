# Aula 05: API CRUD de notas

Express + Body-Parser; dados são lidos e gravados em `data.json`, conforme o enunciado.

## Rodar localmente

```bash
npm install
npm run dev
```

A API fica em `http://localhost:3000`.

| Operação | Método e rota | Corpo | Respostas principais |
|---|---|---|---|
| Create | `POST /api/notes` | `{"titulo":"...","texto":"..."}` | `201`, `400` |
| Read | `GET /api/notes` ou `GET /api/notes/:id` | sem corpo | `200`, `404` |
| Update | `PUT /api/notes/:id` | `{"titulo":"...","texto":"..."}` | `200`, `400`, `404` |
| Delete | `DELETE /api/notes/:id` | sem corpo | `204`, `404` |

## Postman

Importe/monte uma coleção com as quatro rotas da tabela. Para POST e PUT use `Body > raw > JSON`; para ID, substitua `:id` pela propriedade `id` retornada pelo GET/POST. Uma coleção pronta está em `../aula05-notas-postman/notes-api.postman_collection.json`.

## Render

Crie um Web Service, Build Command `npm install`, Start Command `npm start`. O sistema de arquivos de instâncias gratuitas pode ser efêmero: para preservar `data.json` após reinicializações é preciso configurar um disco persistente se disponível no plano. O deploy e os repositórios ainda precisam ser feitos por você.
# aula05-notas-api
