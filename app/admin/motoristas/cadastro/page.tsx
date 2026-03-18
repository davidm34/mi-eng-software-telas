import { Suspense } from "react";
import CadastroPage from "./cadastro";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CadastroPage />
    </Suspense>
  );
}