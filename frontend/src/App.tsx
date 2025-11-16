import { useState } from "react";
import "./App.css";
import AppButton from "./components/Button/AppButton";
import AppIconButton from "./components/Button/AppIconButton";
import AppDropdown from "./components/Dropdown/AppDropdown";
import AppDateInput from "./components/Input/AppDateInput/AppDateInput";
import AppInput from "./components/Input/AppInput/AppInput";
import AppNumInput from "./components/Input/AppNumInput/AppNumInput";
import AppModal from "./components/Modal/AppModal";
import type { IDropdownOption } from "./types/IDropDownProps";
import { Table } from "./components/Table/Table";

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
}

function App() {
  const [showModal, setShowModal] = useState(false);
  const dropOpt: IDropdownOption[] = [
    { label: "asdasd", value: "asdasd" },
    { label: "asadasdad", value: "bbbb" },
    { label: "asdasdasd", value: "ccccc" },
  ];
  const users: User[] = [
    { id: "1", name: "Ana", email: "ana@email.com", age: 28 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
    { id: "2", name: "Carlos", email: "carlos@email.com", age: 34 },
  ];

  return (
    <div>
      <h1 className="bg-amber-600">Inisira</h1>
      <div className="max-w-[120px]">
        <AppInput label="teste" cpf={true} required={true}></AppInput>
        <AppNumInput label="teste num" min={12} max={30}></AppNumInput>
        <AppDateInput label="teste num"></AppDateInput>
        <AppIconButton
          disabled={true}
          onClick={() => {
            console.log("oiii");
          }}
          iconName="Trash"
        />
        <AppButton
          disabled={true}
          label="Salvar"
          onClick={() => console.log("salvar")}
        ></AppButton>
        <AppDropdown label="Teste" options={dropOpt}></AppDropdown>
        <AppIconButton
          onClick={() => {
            setShowModal(true);
          }}
          iconName="Trash"
        />
        <AppModal isOpen={showModal} onClose={() => setShowModal(false)}>
          <h2 className="text-xl font-bold mb-4">Formulário</h2>
        </AppModal>
        <div className="mt-[30px] ml-[60px]">
          <Table<User>
            data={users}
            columns={[
              { accessorKey: "name", header: "Nome" },
              { accessorKey: "email", header: "Email" },
              { accessorKey: "age", header: "Idade" },
            ]}
            onEdit={(user) => console.log("Editar", user)}
            onDelete={(id) => console.log("Excluir", id)}
            onAddClick={() => console.log("Adicionar novo usuário")}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
