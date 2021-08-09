// import styled from "styled-components";
import MainGrid from "../src/componentes/MainGrid";
import Box from "../src/componentes/Box";
import { v4 as uuidv4 } from "uuid";
import nookies from "nookies";
import jwt from "jsonwebtoken";

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";
import { ProfileRelationsBoxWrapper } from "../src/componentes/profileRelations";
import React, { useEffect, useState } from "react";

function ProfileSidebar(propriedades) {
  return (
    // as="aside": transforma o componente em uma sideBar sem precisar criar outro componente
    <Box as="aside">
      <img
        src={`https://github.com/${propriedades.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      {/* hr: usada para separar o conteúdo um do outro */}
      <hr />

      <p>
        <a
          className="boxLink"
          href={`https://github.com/${propriedades.githubUser}`}
        >
          @{propriedades.githubUser}
        </a>
      </p>
      {/* hr: usada para separar o conteúdo um do outro */}
      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

function ProfileRelationsBox(propriedades) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {propriedades.title} ({propriedades.items.length})
      </h2>
      {
        <ul>
          {/* .slice(0, 6): Pega os 6 primeiros usuários no array */}
          {/* mas tbm poderia pegar os 6 ultimos, basta trocar por 'slice(-6)' */}
          {propriedades.items.slice(0, 6).map((itemAtual) => {
            return (
              <li key={itemAtual.id}>
                <a
                  href={itemAtual.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Site do usuário"
                >
                  <img src={itemAtual.avatar_url} alt="Avatar do usuário" />
                  <span>{itemAtual.login}</span>
                </a>
              </li>
            );
          })}
        </ul>
      }
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home(props) {
  const githubUser = props.githubUser;
  const pessoasFavoritas = ["omariosouto", "peas", "diego3g"];

  const [seguidores, setSeguidores] = useState([]);

  const [comunidades, setComunidades] = useState([]);

  useEffect(() => {
    // GET
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });
    // []: 2° parametro que especificia qnd ele irá atualizar dependendo da variavel passada para ele
    // ele sendo vazio, irá executar apenas uma vez

    // API GraphQL
    fetch("https://graphql.datocms.com/", {
      method: "POST",
      headers: {
        Authorization: "dd51b7dc562d7693991948ec695b2a",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        // Consulta para a API
        query: `
      query{
        allCommunities {
          title
          id
          imageUrl
          creatorSlug
        }
      }
      `,
      }),
    })
      .then((response) => response.json())
      .then((respostaCompleta) => {
        const comunidadesVindaDoDato = respostaCompleta.data.allCommunities;
        setComunidades(comunidadesVindaDoDato);
        console.log(respostaCompleta);
      });
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
        <div className="profileArea" menu style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)!</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">Crie sua comunidade</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                // Previnindo autoupdate da pagina
                e.preventDefault();

                // trazendo dados do formulario
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  title: dadosDoForm.get("titulo"),
                  imageUrl: dadosDoForm.get("imagem"),
                  creatorSlug: githubUser,
                };

                //Chamando meu servidor localizado no pages
                fetch("/api/comunidades", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(comunidade),
                }).then(async (response) => {
                  const dados = await response.json();

                  const comunidade = dados.registroCriado;

                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                });
              }}
            >
              <div>
                <input
                  type="text"
                  placeholder="Qual vai ser o nome da sua comunidade?"
                  name="titulo"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>

              <div>
                <input
                  placeholder="Coloque uma url para usarmos de capa"
                  name="imagem"
                  aria-label="Qual vai ser o nome da sua comunidade?"
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Comunidades ({comunidades.length})</h2>
            <ul>
              {comunidades.slice(0, 6).map((itemAtual) => {
                return (
                  <li>
                    <a href={`/comunidades/${itemAtual.id}`} key={itemAtual.id}>
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>

          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da comunidade ({pessoasFavoritas.length})
            </h2>
            <ul>
              {pessoasFavoritas.slice(0, 6).map((itemAtual) => {
                return (
                  <li>
                    <a href={`/users/${itemAtual}`} key={uuidv4()}>
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

// Permite que enquanto a pagina esta sendo renderizada, vc decida se quer renderizar ou encaminhar para uma autenticação( como nesse caso)
export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  // Impede acesso da dashboard caso nao possua um cookie
  if (!cookies.USER_TOKEN) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  //Verificando se o token é valido
  const token = cookies.USER_TOKEN;
  const { isAuthenticated } = await fetch(
    "https://alurakut-vinixiii.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  )
    .then((resposta) => resposta.json())
    .catch((err) => console.error(err));

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser,
    },
  };
}
