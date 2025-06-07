import { useState, useEffect } from "react";
import {
  Calendar,
  Badge,
  Modal,
  Button,
  Input,
  HStack,
  Message,
  TimePicker,
} from "rsuite";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  const [eventos, setEventos] = useState({});
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [formulario, setFormulario] = useState({ horario: "", titulo: "" });
  const [erro, setErro] = useState("");
  const [indiceEdicao, setIndiceEdicao] = useState(null);

  // Notificação para eventos na hora certa
  useEffect(() => {
    const intervalo = setInterval(() => {
      const agora = new Date();
      const chaveHoje = obterChaveData(agora);
      const horaAgora = agora.toTimeString().slice(0, 5);
      if (eventos[chaveHoje]) {
        eventos[chaveHoje].forEach((evento) => {
          if (evento.horario === horaAgora) {
            toast.info(`Lembrete: ${evento.titulo} agora (${evento.horario})`, {
              position: "top-right",
              autoClose: 10000,
              toastId: `${chaveHoje}-${evento.horario}-${evento.titulo}`,
            });
          }
        });
      }
    }, 60000); // Checa a cada minuto
    return () => clearInterval(intervalo);
  }, [eventos]);

  // Simula busca inicial dos eventos (GET)
  useEffect(() => {
    function buscarEventosSimulado() {
      const dados = {
        "2025-06-15": [{ horario: "09:00", titulo: "Evento do banco" }],
        "2025-06-10": [{ horario: "09:00", titulo: "Evento do banco" }],
      };
      setEventos(dados);
      // toast.success("Eventos carregados com sucesso!");
    }
    buscarEventosSimulado();
  }, []);

  const aoSelecionarData = (data) => {
    setDataSelecionada(data);
    setErro("");
  };

  const aoAlterarFormulario = (campo, valor) => {
    setFormulario((anterior) => ({ ...anterior, [campo]: valor }));
    setErro("");
  };

  // Validação de horário (HH:mm)
  const horarioValido = (horario) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(horario);

  // Função utilitária para garantir o formato correto da data (YYYY-MM-DD)
  function obterChaveData(data) {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  }

  const aoEditarEvento = (indice) => {
    const chaveData = obterChaveData(dataSelecionada);
    const evento = eventos[chaveData][indice];
    setFormulario({ horario: evento.horario, titulo: evento.titulo });
    setIndiceEdicao(indice);
    setMostrarModal(true);
  };

  // Simula remoção de evento (DELETE)
  const aoDeletarEvento = async (indice) => {
    const chaveData = obterChaveData(dataSelecionada);
    try {
      setEventos((anterior) => {
        const atualizado = { ...anterior };
        if (atualizado[chaveData]) {
          atualizado[chaveData] = atualizado[chaveData].filter(
            (_, i) => i !== indice
          );
          if (atualizado[chaveData].length === 0) delete atualizado[chaveData];
        }
        return atualizado;
      });
      toast.success("Evento deletado com sucesso!");
    } catch {
      setErro("Erro ao deletar evento.");
      toast.error("Erro ao deletar evento.");
    }
  };

  // Simula edição e criação de evento (PUT/POST)
  const aoConfirmar = async () => {
    if (!formulario.horario || !formulario.titulo) {
      setErro("Preencha todos os campos.");
      toast.warn("Preencha todos os campos.");
      return;
    }
    if (!horarioValido(formulario.horario)) {
      setErro("Horário inválido. Use o formato HH:mm.");
      toast.warn("Horário inválido. Use o formato HH:mm.");
      return;
    }
    const chaveData = obterChaveData(dataSelecionada);

    if (indiceEdicao !== null) {
      // Editar evento existente (PUT simulado)
      setEventos((anterior) => {
        const atualizado = { ...anterior };
        if (atualizado[chaveData]) {
          atualizado[chaveData][indiceEdicao] = {
            horario: formulario.horario,
            titulo: formulario.titulo,
          };
        }
        return atualizado;
      });
      toast.success("Evento editado com sucesso!");
    } else {
      // Adicionar novo evento (POST simulado)
      setEventos((anterior) => ({
        ...anterior,
        [chaveData]: [
          ...(anterior[chaveData] || []),
          { horario: formulario.horario, titulo: formulario.titulo },
        ],
      }));
      toast.success("Evento adicionado com sucesso!");
    }
    setMostrarModal(false);
    setFormulario({ horario: "", titulo: "" });
    setIndiceEdicao(null);
  };

  const renderizarCelula = (data) => {
    const chaveData = obterChaveData(data);
    if (eventos[chaveData] && eventos[chaveData].length > 0) {
      return <Badge className="calendar-todo-item-badge" />;
    }
    return null;
  };

  // As funções abaixo simulam as operações CRUD, mas não fazem requisições reais
  async function buscarEventosAPI() {
    try {
      // Simulação de busca
      toast.info("Busca simulada de eventos.");
    } catch (err) {
      setErro("Erro ao buscar eventos.");
      toast.error("Erro ao buscar eventos.");
    }
  }

  async function editarEvento(chaveData, indice, eventoAtualizado) {
    try {
      // Simulação de edição
      setEventos((anterior) => {
        const atualizado = { ...anterior };
        if (atualizado[chaveData]) {
          atualizado[chaveData][indice] = eventoAtualizado;
        }
        return atualizado;
      });
      toast.success("Evento editado (simulado)!");
    } catch (err) {
      setErro("Erro ao editar evento.");
      toast.error("Erro ao editar evento.");
      throw err;
    }
  }

  async function deletarEvento(chaveData, indice) {
    try {
      // Simulação de remoção
      setEventos((anterior) => {
        const atualizado = { ...anterior };
        if (atualizado[chaveData]) {
          atualizado[chaveData] = atualizado[chaveData].filter(
            (_, i) => i !== indice
          );
          if (atualizado[chaveData].length === 0) delete atualizado[chaveData];
        }
        return atualizado;
      });
      toast.success("Evento deletado (simulado)!");
    } catch (err) {
      setErro("Erro ao remover evento.");
      toast.error("Erro ao remover evento.");
      throw err;
    }
  }

  return (
    <>
      <ToastContainer />
      <HStack spacing={10} style={{ height: 320 }} alignItems="flex-start" wrap>
        <Calendar
          compact
          renderCell={renderizarCelula}
          onSelect={aoSelecionarData}
          style={{ width: 320 }}
        />
        <div>
          <h3>Eventos do dia</h3>
          <ul>
            {(eventos[dataSelecionada?.toISOString().split("T")[0]] || []).map(
              (evento, i) => (
                <li
                  key={i}
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  {evento.horario} - {evento.titulo}
                  <Button
                    size="xs"
                    appearance="ghost"
                    onClick={() => aoEditarEvento(i)}
                    style={{ marginLeft: 8 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="xs"
                    appearance="ghost"
                    color="red"
                    onClick={() => aoDeletarEvento(i)}
                  >
                    Deletar
                  </Button>
                </li>
              )
            )}
          </ul>
          <Button
            appearance="primary"
            style={{ marginTop: 16 }}
            onClick={() => {
              setMostrarModal(true);
              setFormulario({ horario: "", titulo: "" });
              setIndiceEdicao(null);
            }}
            disabled={!dataSelecionada}
          >
            Adicionar Evento
          </Button>
        </div>
      </HStack>
      <Modal
        open={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          setIndiceEdicao(null);
        }}
      >
        <Modal.Header>
          <Modal.Title>
            {indiceEdicao !== null ? "Editar Evento" : "Adicionar Evento"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TimePicker
            format="HH:mm"
            value={
              formulario.horario
                ? new Date(`1970-01-01T${formulario.horario}:00`)
                : null
            }
            onChange={(data) => {
              const horarioStr = data ? data.toTimeString().slice(0, 5) : "";
              aoAlterarFormulario("horario", horarioStr);
            }}
            style={{ marginBottom: 10, width: "100%" }}
            placeholder="Selecione o horário"
          />
          <Input
            placeholder="Título"
            value={formulario.titulo}
            onChange={(valor) => aoAlterarFormulario("titulo", valor)}
          />
          {erro && (
            <Message
              type="error"
              description={erro}
              style={{ marginTop: 10 }}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={aoConfirmar} appearance="primary">
            Confirmar
          </Button>
          <Button
            onClick={() => {
              setMostrarModal(false);
              setIndiceEdicao(null);
            }}
            appearance="subtle"
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
