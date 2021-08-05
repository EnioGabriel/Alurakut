// import styled from "styled-components";
import MainGrid from "../src/componentes/MainGrid";
import Box from "../src/componentes/Box";
import { v4 as uuidv4 } from "uuid";

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
      {/* <ul>
        {seguidores.map((itemAtual) => {
          return (
            <li>
              <a href={`https://github.com${itemAtual}.png`} key={itemAtual.id}>
                <img src={itemAtual} />
                <span>{itemAtual}</span>
              </a>
            </li>
          );
        })}
      </ul> */}
    </ProfileRelationsBoxWrapper>
  );
}

export default function Home() {
  const githubUser = "EnioGabriel";
  const pessoasFavoritas = ["omariosouto", "peas", "diego3g"];

  const [comunidades, setComunidades] = useState([
    {
      id: uuidv4(),
      titulo: "Eu odeio acordar cedo",
      imagem: "https://alurakut.vercel.app/capa-comunidade-01.jpg",
    },
  ]);

  const [seguidores, setSeguidores] = useState([]);

  useEffect(() => {
    fetch("https://api.github.com/users/peas/followers")
      .then((respostaDoServidor) => {
        return respostaDoServidor.json();
      })
      .then((respostaCompleta) => {
        setSeguidores(respostaCompleta);
      });
    // []: 2° parametro que especificia qnd ele irá atualizar dependendo da variavel passada para ele
    // ele sendo vazio, irá executar apenas uma vez
  }, []);

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={githubUser} />
        </div>

        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer</h2>
            <form
              onSubmit={function handleCriaComunidade(e) {
                // Previnindo autoupdate da pagina
                e.preventDefault();

                // trazendo dados do formulario
                const dadosDoForm = new FormData(e.target);

                const comunidade = {
                  id: uuidv4(),
                  titulo: dadosDoForm.get("titulo"),
                  imagem: dadosDoForm.get("imagem"),
                };

                const comunidadesAtualizadas = [...comunidades, comunidade];
                setComunidades(comunidadesAtualizadas);
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
            <h2>Comunidades ({comunidades.length})</h2>
            <ul className="limitSize">
              {comunidades.map((itemAtual) => {
                return (
                  <li>
                    <a href={`/users/${itemAtual.titulo}`} key={itemAtual.id}>
                      <img src={itemAtual.imagem} />
                      <span>{itemAtual.titulo}</span>
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
            <ul className="limitSize">
              {pessoasFavoritas.map((itemAtual) => {
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
