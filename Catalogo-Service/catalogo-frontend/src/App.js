import logo from './logo.svg';
import './App.css';
import React from "react";
import Catalogo from './components/Catalogo';
import UploadCatalog from './components/UploadCatalog';

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Catálogo AWS</h1>
      <Catalogo />
      <UploadCatalog />
    </div>
  );
}

export default App;
