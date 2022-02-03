//Boa noite!
//Não tive como parar muito tempo para desenvolver de forma mais clara e componentizada essa aplicação, pois estou viajando,
//Então uso essa linha de comentário para pedir desculpas e deixar claro que sei que de forma componentizada o código ficaria mais
//fluído e claro.

import "./App.css";
import "antd/dist/antd.css";
import * as React from "react";
import { Layout, Input, Card, Rate, Tabs } from "antd";

import axios from "axios";

//Essas são algumas conts requeridas para componentes do AntD (Framework front-end utilizado)
const { Search } = Input;
const { Content, Footer } = Layout;
const { TabPane } = Tabs;

function App() {
  const [posts, setPosts] = React.useState([]); //State responsável por manter os dados da API do Google
  const [favs, setFavs] = React.useState([]); //State responsável por manter os dados da nossa API (backend)
  const [searchText, setSearchText] = React.useState([]); //State responsável por manter os dados do campo de pesquisa
  const [updater, setUpdater] = React.useState(0); //State responsável por manter dados do Updater (Forma rápida que encontrei de forçar uma atualização dos state de livros)

  // Essa const é responsável por forçar a atualizção do state quando trocamos de "tab" no frontend
  const handleChangePane = (key) => {
    if (key === "1") {
      axios.get(`http://127.0.0.1:3333/favbooks`).then((response) => {
        console.log("change pane", response.data);
        setFavs(response.data);
        const newUpdate = updater + 1;
        setUpdater(newUpdate);
      });
    }
  };

  //Requisições de get
  React.useEffect(() => {
    axios
      .get(`http://127.0.0.1:3333/favbooks`)
      .then((response) => {
        setFavs(response.data);
      })
      .catch((err) => {
        console.log("Erro na requisição!", err);
      });

    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=sherlock`)
      .then((googleResponse) => {
        setPosts(googleResponse.data.items);
      })
      .catch((err) => {
        console.log("Erro na requisição!", err);
      });
  }, []);

  //Const que seta o valor da pesquisa
  const handleOnChangeSearch = (e) => {
    console.log("search text: ", e.target.value);
    setSearchText(e.target.value);
  };

  //Const que verifica se o livro é favorito, se não for, quando clicamos na "estrela" ele será favoritado(post),
  //se for, quando clicamos na "estrela" ele será excluído(delete)
  const handleOnChangeStar = (currentBook) => {
    console.log("coming value> ", currentBook);
    const findFavIndex = favs.findIndex(
      (fav) =>
        fav.book_id === currentBook.id || fav.book_id === currentBook.book_id
    );
    if (findFavIndex !== -1) {
      const findFav = favs[findFavIndex];
      axios({
        method: "delete",
        url: `http://127.0.0.1:3333/delete/${findFav.id}`,
      })
        .then((response) => {
          console.log("data", response.data);
          favs.splice(findFavIndex, 1);
          setFavs([...favs]);
        })
        .catch((err) => {
          console.log("Erro na requisição!", err);
        });
    } else {
      axios({
        method: "post",
        url: "http://127.0.0.1:3333/add",
        headers: {},
        data: {
          //Body da requisição
          book_id: currentBook.id,
          favbook_description: currentBook.volumeInfo.description,
          favbook_title: currentBook.volumeInfo.title,
          favbook_publisher: currentBook.volumeInfo.publisher,
        },
      })
        .then((response) => {
          axios
            .get(`http://127.0.0.1:3333/favbooks`)
            .then((response) => {
              console.log("data", response.data);
              setFavs(response.data);
              console.log("new favs", favs);
            })
            .catch((err) => {
              console.log("Erro na requisição!", err);
            });
        })
        .catch((err) => {
          console.log("Erro na requisição!", err);
        });
    }
  };

  //Const que determina quando a pesquisa é feita, ou seja, quando o botão do Input for pressionado
  const handleOnSearchTrigger = () => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}`) //Requisição que busca pela informação colocado no
      //Input de pesquisa
      .then((response) => {
        console.log("data", response.data);
        setPosts(response.data.items);
      })
      .catch((err) => {
        console.log("Erro na requisição!", err);
      });
  };

  //Const usada para determinar que um livro favorito, mesmo quando aparecer na aba "todos os livros", deverá aparecer
  //como favorito(estrelado)
  const handleDefaultStar = (post) => {
    if (favs.find((fav) => fav.book_id === post.id)) {
      return 1;
    }
    return 0;
  };

  return (
    <Layout className="layout">
      <Content style={{ padding: "0 50px", marginTop: "50px" }}>
        <div className="site-layout-content">
          <Tabs defaultActiveKey="1" onChange={handleChangePane}>
            <TabPane tab="Todos os Livros" key="1">
              <Search
                placeholder="Pesquise livros..."
                style={{ width: "300px", margin: "20px" }}
                enterButton
                onSearch={handleOnSearchTrigger}
                onChange={handleOnChangeSearch}
              />
              {posts.map((post) => {
                return (
                  <div key={`${post.id}${updater}`}>
                    <Card
                      title={post.volumeInfo.title}
                      extra={
                        <Rate
                          onChange={() => handleOnChangeStar(post)}
                          count={1}
                          defaultValue={handleDefaultStar(post)}
                        />
                      }
                      style={{ width: 500, margin: 20 }}
                    >
                      <h3>Descrição:</h3>
                      <p>{post.volumeInfo.description}</p>
                      <h3>Editora:</h3>
                      <p>{post.volumeInfo.publisher}</p>
                    </Card>
                  </div>
                );
              })}
            </TabPane>
            <TabPane tab="Livros Favoritos" key="2">
              {favs.map((fav) => {
                return (
                  <div key={fav.book_id}>
                    <Card
                      title={fav.favbook_title}
                      style={{ width: 500, margin: 20 }}
                      extra={
                        <Rate
                          onChange={() => handleOnChangeStar(fav)}
                          count={1}
                          defaultValue={1}
                        />
                      }
                    >
                      <h3>Descrição:</h3>
                      <p>{fav.favbook_description}</p>
                      <h3>Editora:</h3>
                      <p>{fav.favbook_publisher}</p>
                      <h3>Favoritado em:</h3>
                      <p>{fav.created_at}</p>
                    </Card>
                  </div>
                );
              })}
            </TabPane>
          </Tabs>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Created by Eduardo Colissi Wiceskoski ©2022
      </Footer>
    </Layout>
  );
}

export default App;
