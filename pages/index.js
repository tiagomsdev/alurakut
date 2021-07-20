import styled from 'styled-components'
import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations'

const Title = styled.h1`
  font-size: 50px;
  color: ${({ theme }) => theme.colors.primary};
`

function ProfileSideBar(prop){
  return (
    <Box>
        <img src={`https://github.com/${prop.githubUser}.png`} style={{borderRadius: '8px'}}></img>
        <hr/>
        <p>
          <a className = "boxLink" href={`https://github.com/${prop.githubUser}`}>
            @{prop.githubUser}
          </a>
        </p>
        <hr/>

      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}

function ProfileRelationsBox(propriedades){
  return (
    <ProfileRelationsBoxWrapper>
       <h2 className="smallTitle">
         {propriedades.title} ({propriedades.items.length})
       </h2>
       <ul>
            {/* {comunidades.map((item) => {
              return (
                <li key={item.id}>
                  <a href={`/users/${item.title}`} key={item.title}>
                    <img src={item.image}/>
                    <span>{item.title}</span>
                  </a>
                </li>
              )
            })} */}
          </ul>
       </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const user = 'tiagomsdev';
  const [comunidades, setComunidades] = React.useState([{
    id: '3849839486094850694u506894705897604960497',
    title: 'Eu odeio acordar cedo',
    image: 'https:alurakut.vercel.app/capa-comunidade-01.jpg'
  }]); //Cria o estado para comunidades

  const pessoasFavoritas = ['juunegreiros','omariosouto','peas','rafaballerini','marcobrunodev','felipefialho']

  const [seguidores,SetSeguidores] = React.useState([]);
  React.useEffect(function (){
    fetch('https://api.github.com/users/peas/followers')
    .then(function (respostaDoServidor){
      return respostaDoServidor.json();
    })
    .then(function (respostaCompleta){
      SetSeguidores(respostaCompleta)
    })
  }, [])
  

  return (
    <>
    <AlurakutMenu/>
    <MainGrid>
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <ProfileSideBar githubUser={user}/>
      </div>
      <div className="welcomeArea" style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem vindo(a)
          </h1>
          <OrkutNostalgicIconSet/>
        </Box>
        <Box>
          <h2 className="subTitle">O que deseja fazer?</h2>
          <form onSubmit={function handleCriaComunidade(e){
            e.preventDefault();
            const dadosForm = new FormData(e.target);

            const comunidade = {
              id: new Date().toISOString,
              title: dadosForm.get('title'),
              image: dadosForm.get('image'),
            }

            const comunidadesAtualizadas = [...comunidades, comunidade]
            console.log(comunidades);
            console.log(comunidadesAtualizadas);
            setComunidades(comunidadesAtualizadas);

          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title"
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma url para usarmos de capa"
                name="image"
                aria-label="Coloque uma url para usarmos de capa"
              />
            </div>
            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>  
      <div className="profileRelationsArea" style={{gridArea: 'profileRelationsArea'}}>
       <ProfileRelationsBox title="Seguidores" items={seguidores} />
       <ProfileRelationsBoxWrapper>
       <ul>
            {comunidades.map((item) => {
              return (
                <li key={item.id}>
                  <a href={`/users/${item.title}`} key={item.title}>
                    <img src={item.image}/>
                    <span>{item.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
       </ProfileRelationsBoxWrapper>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
            Pessoas da Comunidade ({pessoasFavoritas.length})
          </h2>
          <ul>
            {pessoasFavoritas.map((item) => {
              return (
                <li key={item}>
                  <a href={`/users/${item}`} key={item}>
                    <img src={`https://github.com/${item}.png`}/>
                    <span>{item}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
    </>
  )
}
