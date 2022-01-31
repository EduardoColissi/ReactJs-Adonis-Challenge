import "./App.css";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import { Input } from "antd";

const { Search } = Input;
const { Header, Content, Footer } = Layout;

function App() {
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
            placeholder="Pesquise livros..."
            style={{ width: "300px" }}
            enterButton
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Created by Eduardo Colissi Wiceskoski ©2022
      </Footer>
    </Layout>
  );
}

export default App;
