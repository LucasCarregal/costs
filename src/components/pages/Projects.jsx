import { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import Message from "../layout/Message";

import styles from "./Projects.module.css";
import Container from "../layout/Container";
import Loading from "../layout/Loading";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoadind, setremoveLoadind] = useState(false);
  const [projectMessage, setProjectMessage] = useState("");

  useEffect(() => {
    setTimeout(() => {
      fetch("http://localhost:5000/projects", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setProjects(data);
          setremoveLoadind(true);
        });
    }, 1000);
  }, []);

  function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setProjects(projects.filter((project) => project.id != id));
        setProjectMessage("Projeto removido com sucesso!");
      });
  }

  const location = useLocation();
  let message = "";

  if (location.state) {
    message = location.state.message;
  }

  return (
    <div className={styles.project_container}>
      <div className={styles.title_container}>
        <h1>Meus Projects</h1>
        <LinkButton to="/newproject" text={<FaPlus />} />
      </div>
      {message && <Message text={message} type="success" />}
      {projectMessage && <Message text={projectMessage} type="success" />}
      <Container customClass="start">
        {projects.length > 0 &&
          projects.map((project) => {
            return (
              <ProjectCard
                id={project.id}
                name={project.name}
                budget={project.budget}
                category={project.category.name}
                key={project.id}
                handleRemove={removeProject}
              />
            );
          })}
        {!removeLoadind && <Loading />}
        {removeLoadind && projects.length === 0 && (
          <Message text="Nenhum projeto encontrado" type="empty" />
        )}
      </Container>
    </div>
  );
}

export default Projects;
