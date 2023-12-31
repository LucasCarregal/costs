import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { parse, v4 as uuidv4 } from "uuid";

import styles from "./Project.module.css";
import Loading from "../layout/Loading";
import Container from "../layout/Container";
import ProjectForm from "../project/ProjectForm";
import Message from "../layout/Message";
import ServiceForm from "../services/ServiceForm";

function Project() {
  const { id } = useParams();

  const [project, setProject] = useState({});
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [message, setMessage] = useState();
  const [type, setType] = useState();

  useEffect(() => {
    setTimeout(() => {
      fetch(`http://localhost:5000/projects/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProject(data);
        });
    }, 1000);
  }, [id]);

  function editPost(project) {
    setMessage("");

    // budget validation
    if (project.budget < project.cost) {
      setMessage("O orçamento não pode ser menor que o custo!");
      setType("error");
      return;
    }

    fetch(`http://localhost:5000/projects/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        setShowProjectForm(false);
        setMessage("Projeto Atualizado!");
        setType("success");
      });
  }

  function createService(service) {
    setMessage("");

    // last service
    const lastService = project.services[project.services.length - 1];

    lastService.id = uuidv4();

    const lastServiceCost = lastService.cost;

    const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

    // maximum cost validation
    if (newCost > project.budget) {
      setMessage("Orcamento ultrapassado! Verifique o custo do servico.");
      setType("error");
      project.services.pop();
      return;
    }

    // update project cost
    project.cost = newCost;

    fetch(`http://localhost:5000/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(project),
    })
      .then((response) => response.json())
      .then((data) => {
        setProject(data);
        setShowServiceForm(false);
        setMessage("Servico adicionado!");
        setType("success");
      });
  }

  function toogleShowProjectForm() {
    setShowProjectForm(!showProjectForm);
  }

  function toogleShowServiceForm() {
    setShowServiceForm(!showServiceForm);
  }

  return (
    <>
      {project.name ? (
        <div className={styles.project_details}>
          <Container customClass="column">
            {message && <Message text={message} type={type} />}
            <div className={styles.details_container}>
              <h1>{project.name}</h1>
              <button className={styles.btn} onClick={toogleShowProjectForm}>
                {showProjectForm ? "Fechar" : "Editar Projeto"}
              </button>
              {showProjectForm ? (
                <div className={styles.form}>
                  <ProjectForm
                    handleSubmit={editPost}
                    btnText="Concluir Edição"
                    projectData={project}
                  />
                </div>
              ) : (
                <div className={styles.form}>
                  <p>
                    <span>Categoria: </span> {project.category.name}
                  </p>
                  <p>
                    <span>Total de Orçamento: </span> R$ {project.budget}
                  </p>
                  <p>
                    <span>Total Ultilizado: </span> R$ {project.cost}
                  </p>
                </div>
              )}
            </div>
            <div className={styles.service_form_container}>
              <h2>Adicione um serviço:</h2>
              <button className={styles.btn} onClick={toogleShowServiceForm}>
                {showServiceForm ? "Fechar" : "Adicionar Serviço"}
              </button>
              <div className={styles.form}>
                {showServiceForm && (
                  <ServiceForm
                    handleSubmit={createService}
                    textBtn="Adicionar Servico"
                    projectData={project}
                  />
                )}
              </div>
            </div>
            <h2>Serviços</h2>
            <Container customClass="start">
              <p>Itens do servico</p>
            </Container>
          </Container>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default Project;
