import styled from 'styled-components'
import nookies from 'nookies'
import jwt from 'jsonwebtoken'
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

export default function Home(props) {
  const user = props.githubUser;
  const [comunidades, setComunidades] = React.useState([]); //Cria o estado para comunidades

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

    const token = '66b29a3fa80199224df48ff4529bd3';

  fetch('https://graphql.datocms.com/',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        query : `{
          allCommunities {
            id
            title
            _status
            _firstPublishedAt
            imageUrl
          }
        }` 
      })
    })
    .then((response) => response.json())
    .then((respostaCompleta) => {
      const comunidadesDoDato = respostaCompleta.data.allCommunities; 
      console.log(comunidadesDoDato);
      setComunidades(comunidadesDoDato);
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
              title: dadosForm.get('title'),
              imageUrl: dadosForm.get('image'),
              creatorSlug: user
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {'Content-Type': 'application/json',},
              body: JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json();
              console.log(dados.registroCriado);
              const comunidade = dados.registroCriado;
              const comunidadesAtualizadas = [...comunidades, comunidade]
              setComunidades(comunidadesAtualizadas)
            })


            /*const comunidadesAtualizadas = [...comunidades, comunidade]
            console.log(comunidades);
            console.log(comunidadesAtualizadas);
            setComunidades(comunidadesAtualizadas);*/

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
          <h2 className="smallTitle">
            Comunidades ({comunidades.length})
          </h2>          
          <ul>
            {comunidades.map((item) => {
              return (
                <li key={item.id}>
                  <a href={`/users/${item.title}`} key={item.title}>
                    <img src={item.imageUrl}/>
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

export async function getServerSideProps(context) {

  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  console.log(token);
  
  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
        Authorization: token
    }
  })
  .then((resposta) => resposta.json()) 

  console.log('isAuthenticated: ', isAuthenticated);
  if(!isAuthenticated){
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const {githubUser} = jwt.decode(token);
  return {
    props: {
      githubUser
    },
  }
}