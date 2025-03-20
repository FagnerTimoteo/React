import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function ListarMatriculas() {
    const { id } = useParams();
    const [matriculas, setMatriculas] = useState([]);
    const [disciplinas, setDisciplinas] = useState({});

    useEffect(() => {
        fetch(`https://nodejs-production-b91d.up.railway.app/api/Matricula/all/${id}`)
            .then((response) => response.json())
            .then((data) => {   
                setMatriculas(data);
            })
            .catch((err) => console.error("Erro ao buscar matrículas:", err));
    }, [id]);

    useEffect(() => {
        const fetchDisciplinas = async () => {
            const promises = matriculas.map((matricula) =>
                fetch(`https://nodejs-production-b91d.up.railway.app/api/Disciplinas/${matricula._id}`)
                    .then((response) => response.json())
                    .then((data) => ({ id: matricula._id, ...data }))
                    .catch((err) => console.error("Erro ao buscar disciplina:", err))
            );

            const results = await Promise.all(promises);
            const disciplinaMap = {};
            results.forEach((disciplina) => {
                disciplinaMap[disciplina.id] = disciplina;
            });

            setDisciplinas(disciplinaMap);
        };

        if (matriculas.length > 0) {
            fetchDisciplinas();
        }
    }, [matriculas]);

    const handleDelete = async (id) => {
        console.log(id);
        
        if (window.confirm("Deseja excluir esta matrícula?")) {
            try {
                const response = await fetch(`https://nodejs-production-b91d.up.railway.app/api/Matricula/delete/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                });
    
                if (!response.ok) {
                    const errorData = await response.json();
                    alert(`Erro ao excluir matrícula: ${errorData.msg}`);
                    return;
                }
    
                setMatriculas(prevMatriculas => prevMatriculas.filter(matricula => matricula._id !== id));
    
                alert("Matrícula excluída com sucesso!");
            } catch (err) {
                console.log("Erro ao excluir:", err.message);
            }
        }
    };
    

    return (
        <div className="container mt-4">
            <table className="table table-bordered table-striped">
                <thead className="table-dark">
                    <tr>
                        <th colSpan="4" className="text-center">
                            <Link to={`/Aluno/Matricular/${id}`} className="btn btn-success">
                                Matricular aluno à uma nova disciplina
                            </Link>
                        </th>
                    </tr>
                    <tr>
                        <th>Disciplina</th>
                        <th>Carga Horária</th>
                        <td>Excluir</td>
                    </tr>
                </thead>
                <tbody>
                    {matriculas.map((matricula) => {
                        const disciplina = disciplinas[matricula._id];
                        return (
                            <tr key={matricula._id}>
                                <td>{disciplina ? disciplina.nome : "Carregando..."}</td>
                                <td>{disciplina ? disciplina.cargaHoraria : "Carregando..."}</td>
                                <td>
                                    <button onClick={() => handleDelete(matricula._id)} className="btn btn-danger">
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
