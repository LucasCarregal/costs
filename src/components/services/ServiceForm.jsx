import { useState } from "react";

import Input from "../form/Input";
import Submit from "../form/Submit";

import styles from "../project/ProjectForm.module.css";

function ServiceForm({ handleSubmit, textBtn, projectData }) {
  const [service, setService] = useState({});

  function submit(event) {
    event.preventDefault();
    projectData.services.push(service);
    handleSubmit(projectData);
  }

  function handleChange(e) {
    setService({ ...service, [e.target.name]: e.target.value });
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input
        type="text"
        text="Nome do Servico"
        name="name"
        placeholder="Insira o nome do servico"
        handleOnChange={handleChange}
      />
      <Input
        type="number"
        text="Custo do Servico"
        name="cost"
        placeholder="Insira o valor do servico"
        handleOnChange={handleChange}
      />
      <Input
        type="text"
        text="Descricao do Servico"
        name="description"
        placeholder="Descreva o servico"
        handleOnChange={handleChange}
      />
      <Submit text={textBtn} />
    </form>
  );
}

export default ServiceForm;
