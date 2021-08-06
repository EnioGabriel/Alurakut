import React, { useState } from "react";
// Hook do NextJS
import { useRouter } from "next/router";
// Trabalha com cookies
import nookies from "nookies";

export default function LoginPage() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState("omariosouto");

  return (
    <main
      style={{
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p>
            <strong>Conecte-se</strong> aos seus amigos e familiares usando
            recados e mensagens instantâneas
          </p>
          <p>
            <strong>Conheça</strong> novas pessoas através de amigos de seus
            amigos e comunidades
          </p>
          <p>
            <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
            lugar
          </p>
        </section>

        <section className="formArea">
          <form
            className="box"
            onSubmit={(infosDoEvento) => {
              // previnindo de submeter na propria pagina
              infosDoEvento.preventDefault();

              // Simulando como conectar à um token em uma API
              fetch("https://alurakut.vercel.app/api/login", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ githubUser: githubUser }),
              }).then(async (respostaDoServer) => {
                const dadosDaResposta = await respostaDoServer.json();
                const token = dadosDaResposta.token;
                // criando um cookie
                // 1° param: contexto. Padrao usar o null
                // 2° param: nome da info que está salvando
                // 3° param: valor
                nookies.set(null, "USER_TOKEN", token, {
                  // onde está disponivel para acessar o cookie
                  path: "/",
                  // Validade de expiração do cookie
                  // no caso, 7 dias. '86400' dias em segundos
                  maxAge: 86400 * 7,
                });
                // encaminha para rota da pagina principal
                router.push("/");
              });
            }}
          >
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Dígite seu usuário do github"
              value={githubUser}
              onChange={(evento) => {
                // Pegando o que o usuário dígitou no input
                setGithubUser(evento.target.value);
              }}
            />
            {githubUser.length === 0 ? "Preencha o campo" : ""}
            <button type="submit">Login</button>
          </form>

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>ENTRAR JÁ</strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> -{" "}
            <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> -{" "}
            <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
