import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-toastify/dist/ReactToastify.css';
import Nft from "./Components/Nft/Nft";
import Token from "./Components/Token/Token";
import Info from "./Components/Info/Info";

function App() {

  return (
    <>
      <div>
        <Nft />
        <Token />
        <Info />
      </div>
    </>
  );
}

export default App;