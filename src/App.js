import "./App.css";
import "antd/dist/antd.css";
import * as React from "react";
import { Layout, Menu, Input, Card, Rate } from "antd";

import axios from "axios";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

function App() {
  const [posts, setPosts] = React.useState([]);
  const [searchText, setSearchText] = React.useState([]);
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [limitQuery, setLimitQuery] = React.useState(10);

  React.useEffect(() => {
    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=dq&maxResults=${limitQuery}`
      )
      .then((response) => {
        console.log("data", response.data);
        setPosts(response.data.items);
      })
      .catch((err) => {
        console.log("Erro na requisição!", err);
      });
  }, []);

  const handleOnChangeSearch = (e) => {
    console.log("search text: ", e.target.value);
    setSearchText(e.target.value);
  };

  React.useEffect(() => {
    if (searchText.length >= 10) {
      axios
        .get(`https://www.googleapis.com/books/v1/volumes?q=${searchText}`)
        .then((response) => {
          console.log("data", response.data);
          setPosts(response.data.items);
        })
        .catch((err) => {
          console.log("Erro na requisição!", err);
        });
    }
  }, [searchText]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOnChangeLimit = (e) => {
    setLimitQuery(e.target.value);

    axios
      .get(
        `https://www.googleapis.com/books/v1/volumes?q=dq&maxResults=${limitQuery}`
      )
      .then((response) => {
        console.log("data", response.data);
        setPosts(response.data.items);
      })
      .catch((err) => {
        console.log("Erro na requisição!", err);
      });
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  return (
    <Layout className="layout">
      <Header style={{ backgroundColor: "white" }}>
        <Menu mode="horizontal" defaultSelectedKeys={["2"]}>
          <Menu.Item>Todos os Livros</Menu.Item>
          <Menu.Item>Livros Favoritos</Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px", marginTop: "50px" }}>
        <div className="site-layout-content">
          <Search
            placeholder="Limite de itens"
            style={{ width: "300px" }}
            enterButton
            onChange={handleOnChangeLimit}
          />
          <Search
            placeholder="Pesquise livros..."
            style={{ width: "300px" }}
            enterButton
            onChange={handleOnChangeSearch}
          />
          {posts.map((post, key) => {
            return (
              <div key={key}>
                <Card
                  title={post.volumeInfo.title}
                  extra={<Rate count={1} />}
                  style={{ width: 500 }}
                >
                  <h3>Descrição:</h3>
                  <p>{post.volumeInfo.description}</p>
                  <h3>Autor(es):</h3>
                  <p>{post.volumeInfo.authors}</p>
                  <h3>Editora:</h3>
                  <p>{post.volumeInfo.publisher}</p>
                </Card>
              </div>
            );
          })}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Created by Eduardo Colissi Wiceskoski ©2022
      </Footer>
    </Layout>
  );
}

export default App;
