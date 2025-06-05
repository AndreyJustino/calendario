import { useState, useEffect } from 'react';
import { Calendar, Badge, Modal, Button, Input, HStack, Message, TimePicker } from 'rsuite';

import './App.css';

function App() {
  const [events, setEvents] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ time: '', title: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      const data = {
        "2024-06-01": [{ time: "09:00", title: "Evento do banco" }],
        "2024-06-10": [{ time: "09:00", title: "Evento do banco" }]
      };
      setEvents(data);
      console.log('Eventos carregados:', data);
    }
    fetchEvents();
  }, []);

  const handleSelect = date => {
    setSelectedDate(date);
    setShowModal(true);
    setError('');
  };

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  // Validação de horário (HH:mm)
  const isValidTime = time => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);

  // Função utilitária para garantir o formato correto da data (YYYY-MM-DD)
  function getDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleConfirm = async () => {
    if (!form.time || !form.title) {
      setError('Preencha todos os campos.');
      return;
    }
    if (!isValidTime(form.time)) {
      setError('Horário inválido. Use o formato HH:mm.');
      return;
    }
    const dateKey = getDateKey(selectedDate);
    setEvents(prev => ({
      ...prev,
      [dateKey]: [
        ...(prev[dateKey] || []),
        { time: form.time, title: form.title }
      ]
    }));
    setShowModal(false);
    setForm({ time: '', title: '' });
  };

  const renderCell = date => {
    const dateKey = getDateKey(date);
    if (events[dateKey] && events[dateKey].length > 0) {
      return <Badge className="calendar-todo-item-badge" />;
    }
    return null;
  };

  return (
    <>
      <HStack spacing={10} style={{ height: 320 }} alignItems="flex-start" wrap>
        <Calendar
          compact
          renderCell={renderCell}
          onSelect={handleSelect}
          style={{ width: 320 }}
        />
        <div>
          <h3>Eventos do dia</h3>
          <ul>
            {(events[selectedDate?.toISOString().split('T')[0]] || []).map((ev, i) => (
              <li key={i}>{ev.time} - {ev.title}</li>
            ))}
          </ul>
        </div>
      </HStack>
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>
          <Modal.Title>Adicionar Evento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TimePicker
            format="HH:mm"
            value={form.time ? new Date(`1970-01-01T${form.time}:00`) : null}
            onChange={date => {
              const timeStr = date
                ? date.toTimeString().slice(0, 5)
                : '';
              handleChange('time', timeStr);
            }}
            style={{ marginBottom: 10, width: '100%' }}
            placeholder="Selecione o horário"
          />
          <Input
            placeholder="Título"
            value={form.title}
            onChange={value => handleChange('title', value)}
          />
          {error && <Message type="error" description={error} style={{ marginTop: 10 }} />}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleConfirm} appearance="primary">Confirmar</Button>
          <Button onClick={() => setShowModal(false)} appearance="subtle">Cancelar</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default App;
