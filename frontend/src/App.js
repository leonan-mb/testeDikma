import React, { useState, useEffect } from 'react';
import './App.css'

function App() {
  const [empresas, setEmpresas] = useState([]);
  const [areas, setAreas] = useState([]);
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [descricaoEmpresa, setDescricaoEmpresa] = useState('');
  const [nomeArea, setNomeArea] = useState('');
  const [descricaoArea, setDescricaoArea] = useState('');
  const [idEmpresa, getIdEmpresa] = useState('');


  useEffect(() => {
    fetch('http://localhost:3000/empresas')
      .then(response => response.json())
      .then(data => {
        setEmpresas(data)
      })
  }, []);

  const fetchAreas = (idEmpresa) => {
    fetch(`http://localhost:3000/empresas/${idEmpresa}/areas`)
      .then(response => response.json())
      .then(data => {
        setAreas(data)
      })
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      nomeEmpresa,
      descricaoEmpresa,
    };

    fetch('http://localhost:3000/empresas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Empresa salva com sucesso:', data);
      })
      .catch(error => {
        console.error('Erro ao salvar a empresa:', error);
      });
  };

  return (
    <div className='container'>
      <h1>Empresas</h1>
      <form onSubmit={handleSubmit}>
        <input type='text' placeholder='nome empresa' name='nomeEmpresa' value={nomeEmpresa}
          onChange={(event) => setNomeEmpresa(event.target.value)} className='nameEmpresa' />
        <br></br>
        <textarea placeholder='descrição' name='descricaoEmpresa' value={descricaoEmpresa}
          onChange={(event) => setDescricaoEmpresa(event.target.value)} className='descricaoEmpresa' ></textarea>
        <br></br>
        <button className='btn-insert' type='submit' /* onClick={() => {
          fetch()
        }} */>Inserir</button>
      </form>
      <table className='table-empresa'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
          </tr>
        </thead>
        <tbody>
          {empresas.map((empresa) => (
            <tr key={empresa.idEmpresa}>
              <td>{empresa.idEmpresa}</td>
              <td>{empresa.nomeEmpresa}</td>
              <td>{empresa.descricaoEmpresa}</td>
              <td>
                <button className='btn-table-empresa' onClick={() => fetchAreas(empresa.idEmpresa)}>Listar Áreas</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {areas.length > 0 && (
        <div>
          <h2>Áreas</h2>
         {/*  <form>
            <input type='text' placeholder='nome area' name='nomeArea' value={nomeArea}
          onChange={(event) => setNomeArea(event.target.value)} className='nameEmpresa' />
            <br></br>
            <textarea placeholder='descrição' name='descricaoArea' value={descricaoArea}
          onChange={(event) => setDescricaoArea(event.target.value)} className='descricaoEmpresa' ></textarea>
            <br></br>
            <button className='btn-insert' type='submit' onClick={() => fetch(`http://localhost:3000/empresas/${idEmpresa}/areas`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(nomeArea, descricaoArea),
            })}>Inserir</button>
          </form> */}
          <table className='table-area'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {areas.map((area) => (
                <tr key={area.idArea}>
                  <td>{area.idArea}</td>
                  <td>{area.nomeArea}</td>
                  <td>{area.descricaoArea}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
