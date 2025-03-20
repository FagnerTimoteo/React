import { Link } from "react-router-dom";
import React, { useState, useEffect }  from 'react';

export default function Inicio() {

    const [alunos, setAlunos] = useState([]);
    
    useEffect(() => {
        fetch('https://nodejs-production-b91d.up.railway.app/api/Aluno/all')
            .then((response) => response.json())
            .then((data) => {
            setAlunos(data);
            })
            .catch((err) => {
            console.log(err.message);
            });
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Deseja excluir?")) {
            try {
                const response = await fetch(`https://nodejs-production-b91d.up.railway.app/api/Aluno/delete/${id}`, { 
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Erro ao excluir: ${errorData.msg}`);
                    return;
                }

                setAlunos(prevAlunos => prevAlunos.filter(aluno => aluno._id !== id));
    
                alert("Aluno excluído com sucesso!");
            } catch (err) {
                console.log("Erro ao excluir:", err.message);
            }
        }
    };
    

    function formatarData(dataISO) {
        const [ano, mes, dia] = dataISO.split("T")[0].split("-");
        return `${dia}/${mes}/${ano}`;
    }

    return (<>
        <div className="container mt-4">
        <table className="table table-bordered table-striped">
            <thead className="table-dark">
                <tr>
                    <th colSpan="10" className="text-center">
                        <Link to="/Cadastrar/Aluno" state={{ id: null }} className="btn btn-success">
                            Cadastrar novo aluno
                        </Link>
                    </th>
                </tr>
                <tr>
                    <td>Aluno</td>
                    <td>Endereço</td>
                    <td>Matricula</td>
                    <td>curso</td>
                    <td>Data de Nascimento</td>
                    <td>Telefone</td>
                    <td>Email</td>
                    <td>Disciplinas</td>
                    <td>Editar</td>
                    <td>Excluir</td>
                </tr>
            </thead>
            <tbody>
                { alunos.map((aluno) => (
                    <tr key={aluno._id}>
                        <td> {aluno.nome} </td>
                        <td> {aluno.endereco} </td>
                        <td> {aluno.matricula} </td>
                        <td> {aluno.curso} </td>
                        <td> { formatarData(aluno.dataNascimento) } </td>
                        <td> {aluno.telefone} </td>
                        <td> {aluno.email} </td>
                        <td>
                            <Link to={`/Aluno/Matricula/Listar/${aluno._id}`} state={{ id: aluno._id }} className="btn btn-primary">
                                Disciplinas
                            </Link>
                        </td>
                        <td>
                            <Link to={`/Aluno/Atualizar/${aluno._id}`} state={{ id: aluno._id }} className="btn btn-warning">
                                Editar
                            </Link>
                        </td>
                        <td>
                            <button onClick={() => handleDelete(aluno._id)} className="btn btn-danger">
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