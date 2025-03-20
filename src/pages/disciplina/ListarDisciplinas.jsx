import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';

export default function ListarDisciplinas() {

    const [disciplinas, setDisciplinas] = useState([]);

    const handleDelete = async (id) => {
        if(window.confirm("Deseja excluir?")) {
            try {
                const response = await fetch(`https://nodejs-production-b91d.up.railway.app/api/Disciplinas/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })

                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Erro ao excluir: ${errorData.msg}`);
                    return;
                }
                
                setDisciplinas(prevDisciplina => prevDisciplina.filter(disciplinas => disciplinas._id !== id))

            } catch (err) {
                console.log("Erro ao excluir:", err.message);
            }       
        }
    };

    useEffect(() => {
        fetch('https://nodejs-production-b91d.up.railway.app/api/Disciplinas/all')
            .then((response) => response.json())
            .then((data) => setDisciplinas(data) )
            .catch((err) => console.log(err.message) );
    }, []);

    return (<>
        <div className="container mt-4">
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th colSpan="4" className="text-center">
                        <Link to="/Disciplinas/Cadastrar" state={{ id: null }} className="btn btn-success">
                            Cadastrar nova disciplina
                        </Link>
                        </th>
                    </tr>
                    <tr>
                        <th>Nome</th>
                        <th>Carga Horária</th>
                        <th>Editar</th>
                        <th>Excluir</th>
                    </tr>
                </thead>
                <tbody>
                {disciplinas.map((disciplina) => (
                    <tr key={disciplina._id}>
                    <td>{disciplina.nome}</td>
                    <td>{disciplina.cargaHoraria}</td>
                    <td>
                        <Link to={`/Disciplinas/Atualizar/${disciplina._id}`} state={{ id: disciplina._id }} className="btn btn-warning">
                            Editar
                        </Link>
                    </td>
                    <td>
                        <button onClick={() => handleDelete(disciplina._id)} className="btn btn-danger">
                            Excluir
                        </button>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    </>)
}