import { useEffect, useState } from "react";

import Input from "../form/Input";
import Select from "../form/Select";
import Submit from "../form/Submit";

import styles from "./ProjectForm.module.css";

function ProjectForm({ btnText }) {
  const [categories, seCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/categories", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => seCategories(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <form className={styles.form}>
      <Input
        type="text"
        text="Nome do Projeto"
        name="name"
        placeholder="Insira o nome do projeto"
      />
      <Input
        type="number"
        text="Orçamento do projeto"
        name="budget"
        placeholder="Insira o orçamento total"
      />
      <Select
        text="Selecione a categoria"
        name="category_id"
        options={categories}
      />
      <Submit text={btnText} />
    </form>
  );
}

export default ProjectForm;
