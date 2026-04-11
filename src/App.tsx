import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import FormBuilderPage from "./pages/FormBuilderPage";
import FormPreviewPage from "./pages/FormPreviewPage";
import TodosPage from "./pages/TodosPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/todos" replace />} />
        <Route path="/todos" element={<TodosPage />} />
        <Route path="/form-builder" element={<FormBuilderPage />} />
        <Route path="/form-preview" element={<FormPreviewPage />} />
      </Route>
    </Routes>
  );
}

export default App;
