// Pequna API para enviar o token sem que passe pelo front e exponha dados sensiveis

import { SiteClient } from "datocms-client";

export default async function recebedorDeRequests(request, response) {
  if (request.method === "POST") {
    const TOKEN = "d7c379d00fd3dc5479c1193440b1c8";

    const client = new SiteClient(TOKEN);

    const registroCriado = await client.items.create({
      // 1051930: Model ID do community model no dato cms
      itemType: "1051930",
      ...request.body,
      // // ID: já está sendo criado automaticamente no dato
      // title: "Comunidade teste",
      // imageUrl: "https://github.com/EnioGabriel.png",
      // creatorSlug: "EnioGabriel",
    });

    response.json({
      dados: "",
      registroCriado: registroCriado,
    });
  }
}
