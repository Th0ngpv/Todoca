
import { useEffect, useState } from 'react';
import './App.css';

// Task data model
interface Task {
  id: string;
  title: string;
  description: string;
  dueDate?: string; // ISO string, optional
  dueTime?: string; // HH:mm, optional
  completed: boolean;
}

type View = 'list' | 'calendar' | 'analytics';

const TASKS_KEY = 'student-tasks';

function App() {
  const [showDue, setShowDue] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [view, setView] = useState<View>('list');
  const [form, setForm] = useState<Partial<Task & { dueTime?: string }>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calendar view mode: 'month', 'week', 'day'
  const [calendarMode, setCalendarMode] = useState<'month' | 'week' | 'day'>('month');
  // For week/day, store the reference date (defaults to today)
  const [calendarRefDate, setCalendarRefDate] = useState(() => {
    const d = new Date();
    d.setHours(0,0,0,0);
    return d;
  });

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    if (stored) setTasks(JSON.parse(stored));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // CRUD operations
  // Returns true if date is empty (optional), or if set, is valid and later than today
  const isValidDate = (dateStr: string | undefined, timeStr?: string) => {
    if (!dateStr) return true;
    const d = new Date(dateStr + (timeStr ? 'T' + timeStr : 'T00:00'));
    if (isNaN(d.getTime())) return false;
    const year = d.getFullYear();
    if (year >= 2100) return false;
    // Must be later than now
    return d.getTime() > Date.now();
  };

  const addTask = () => {
    if (!form.title) return;
  if (!isValidDate(form.dueDate, form.dueTime)) return;
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: form.title,
        description: form.description || '',
        dueDate: form.dueDate || '',
  dueTime: form.dueTime || '',
        completed: false,
      } as Task,
    ]);
    setForm({});
  };

  const updateTask = () => {
    if (!editingId || !form.title) return;
  if (!isValidDate(form.dueDate, form.dueTime)) return;
    setTasks(tasks.map(t => t.id === editingId ? { ...t, ...form } as Task : t));
    setEditingId(null);
    setForm({});
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  // Inline editing states
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<'title' | 'description' | 'dueDate' | 'dueTime' | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');

  const startEdit = (task: Task, field: 'title' | 'description' | 'dueDate' | 'dueTime') => {
    setEditingTaskId(task.id);
    setEditingField(field);
    if (field === 'title') setEditingValue(task.title);
    else if (field === 'description') setEditingValue(task.description);
    else if (field === 'dueDate') setEditingValue(task.dueDate || '');
    else if (field === 'dueTime') setEditingValue(task.dueTime || '');
  };

  const finishEdit = (task: Task) => {
    const trimmed = editingValue.trim();
    if (editingField === 'title') {
      if (!trimmed) {
        // Delete task if title is empty or whitespace
        deleteTask(task.id);
      } else {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, title: trimmed } : t));
      }
    } else if (editingField === 'description') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, description: trimmed } : t));
    } else if (editingField === 'dueDate') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, dueDate: trimmed || undefined } : t));
    } else if (editingField === 'dueTime') {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, dueTime: trimmed || undefined } : t));
    }
    setEditingTaskId(null);
    setEditingField(null);
    setEditingValue('');
  };

  // Views
  const renderListView = () => (
    <div>
      <h2>All Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id} className="task-row">
            {/* Section 1: Checkbox */}
            <div className="checkbox-container">
              <input className="task-checkbox" type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id)} />
            </div>
            {/* Section 2: Details (vertical) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'center' }}>
              {/* Title inline edit */}
              {editingTaskId === task.id && editingField === 'title' ? (
                <input
                  autoFocus
                  type="text"
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => finishEdit(task)}
                  onKeyDown={e => { if (e.key === 'Enter') finishEdit(task); }}
                  style={{ fontSize: '1.1em', fontWeight: 700, background: '#18182a', color: '#f3f3f3', border: '1px solid #5ff281', borderRadius: 5, padding: '0.3em 0.7em', marginBottom: 2 }}
                />
              ) : (
                <b
                  style={{ fontSize: '1.1em', fontWeight: 700, cursor: 'pointer', color: '#5ff281', marginBottom: 2 }}
                  onClick={() => startEdit(task, 'title')}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startEdit(task, 'title'); }}
                >
                  {task.title}
                </b>
              )}
              {/* Description inline edit */}
              {editingTaskId === task.id && editingField === 'description' ? (
                <textarea
                  autoFocus
                  value={editingValue}
                  onChange={e => setEditingValue(e.target.value)}
                  onBlur={() => finishEdit(task)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) finishEdit(task); }}
                  style={{ fontSize: '0.98em', color: '#bbb', background: '#18182a', border: '1px solid #5ff281', borderRadius: 5, marginBottom: 2, padding: '0.3em 0.7em', resize: 'vertical', minHeight: 40 }}
                  placeholder="Description"
                />
              ) : (
                <div
                  style={{ fontSize: '0.98em', color: '#bbb', marginBottom: 2, cursor: 'pointer', minHeight: 18 }}
                  onClick={() => startEdit(task, 'description')}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startEdit(task, 'description'); }}
                  title="Click to edit description"
                >
                  {task.description || <span style={{ color: '#444' }}>[Add description]</span>}
                </div>
              )}
              {/* Due date and due time inline edit (only if dueDate exists) */}
              {task.dueDate && (
                <div style={{ fontSize: '0.82em', color: '#5ff281', display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Due date editable */}
                  {editingTaskId === task.id && editingField === 'dueDate' ? (
                    <input
                      autoFocus
                      type="date"
                      value={editingValue}
                      max="2099-12-31"
                      onChange={e => setEditingValue(e.target.value)}
                      onBlur={() => finishEdit(task)}
                      onKeyDown={e => { if (e.key === 'Enter') finishEdit(task); }}
                      style={{ background: '#18182a', color: '#5ff281', border: '1px solid #5ff281', borderRadius: 5, padding: '0.2em 0.5em', fontSize: '0.82em', minWidth: 120 }}
                    />
                  ) : (
                    <span
                      className="due-editable"
                      style={{ cursor: 'pointer', fontSize: '0.82em' }}
                      onClick={() => startEdit(task, 'dueDate')}
                      tabIndex={0}
                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startEdit(task, 'dueDate'); }}
                      title="Click to edit due date"
                    >
                      {task.dueDate}
                    </span>
                  )}
                  {/* Due time editable only by clicking on due time */}
                  <span style={{ marginLeft: 4 }}>
                    {editingTaskId === task.id && editingField === 'dueTime' ? (
                      <input
                        autoFocus
                        type="time"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        onBlur={() => finishEdit(task)}
                        onKeyDown={e => { if (e.key === 'Enter') finishEdit(task); }}
                        style={{ background: '#18182a', color: '#5ff281', border: '1px solid #5ff281', borderRadius: 5, padding: '0.2em 0.5em', fontSize: '0.82em', minWidth: 70 }}
                      />
                    ) : (
                      <span
                        className="due-editable"
                        style={{ cursor: 'pointer', fontSize: '0.82em' }}
                        onClick={() => startEdit(task, 'dueTime')}
                        tabIndex={0}
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') startEdit(task, 'dueTime'); }}
                        title="Click to edit due time"
                      >
                        {task.dueTime || <span style={{ color: '#444' }}>[Add time]</span>}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );

  const renderCalendarView = () => {
    // Helper: get ISO date string (yyyy-mm-dd) from Date
    const toISO = (d: Date) => d.toISOString().slice(0, 10);
    // Helper: get week start (Monday) for a date
    const getWeekStart = (d: Date) => {
      const day = d.getDay();
      const diff = (day === 0 ? -6 : 1) - day; // Monday as start
      const monday = new Date(d);
      monday.setDate(d.getDate() + diff);
      monday.setHours(0,0,0,0);
      return monday;
    };
    // Filter tasks by calendarMode
    let filteredTasks: Task[] = tasks.filter(task => task.dueDate);
    let header = '';
    if (calendarMode === 'day') {
      const iso = toISO(calendarRefDate);
      filteredTasks = filteredTasks.filter(t => t.dueDate === iso);
      header = calendarRefDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' });
    } else if (calendarMode === 'week') {
      const weekStart = getWeekStart(calendarRefDate);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      filteredTasks = filteredTasks.filter(t => {
        const d = new Date(t.dueDate!);
        d.setHours(0,0,0,0);
        return d >= weekStart && d <= weekEnd;
      });
      header = `${weekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } else {
      // month
      const y = calendarRefDate.getFullYear();
      const m = calendarRefDate.getMonth();
      filteredTasks = filteredTasks.filter(t => {
        const d = new Date(t.dueDate!);
        return d.getFullYear() === y && d.getMonth() === m;
      });
      header = calendarRefDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    }
    // Group filtered tasks by dueDate
    const grouped: { [date: string]: Task[] } = {};
    filteredTasks.forEach(task => {
      if (!grouped[task.dueDate!]) grouped[task.dueDate!] = [];
      grouped[task.dueDate!].push(task);
    });
    const sortedDates = Object.keys(grouped).sort();
    // Navigation controls
    const changeRefDate = (amount: number) => {
      const d = new Date(calendarRefDate);
      if (calendarMode === 'day') d.setDate(d.getDate() + amount);
      else if (calendarMode === 'week') d.setDate(d.getDate() + 7 * amount);
      else if (calendarMode === 'month') d.setMonth(d.getMonth() + amount);
      setCalendarRefDate(d);
    };
    return (
      <div>
        <h2>Calendar View</h2>
        <div className="calendar-options-bar calendar-options-bar--vertical">
          <div className="calendar-options-row calendar-options-row--modes">
            <button style={{ background: calendarMode === 'month' ? '#3fdc6b' : undefined }} onClick={() => setCalendarMode('month')}>Month</button>
            <button style={{ background: calendarMode === 'week' ? '#3fdc6b' : undefined }} onClick={() => setCalendarMode('week')}>Week</button>
            <button style={{ background: calendarMode === 'day' ? '#3fdc6b' : undefined }} onClick={() => setCalendarMode('day')}>Day</button>
          </div>
          <div className="calendar-options-row calendar-options-row--nav">
            <button onClick={() => changeRefDate(-1)} title="Previous" style={{ fontWeight: 700, fontSize: '1.1em' }}>{'<'}</button>
            <span style={{ minWidth: 120, textAlign: 'center', fontWeight: 600, wordBreak: 'break-word' }}>{header}</span>
            <button onClick={() => changeRefDate(1)} title="Next" style={{ fontWeight: 700, fontSize: '1.1em' }}>{'>'}</button>
          </div>
        </div>
        {sortedDates.length === 0 ? (
          <div style={{ color: '#bbb', marginTop: 12 }}>No tasks for this {calendarMode}.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {sortedDates.map(date => (
              <div key={date} style={{ background: '#18182a', borderRadius: 8, padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, color: '#5ff281', fontSize: '1.08em', marginBottom: 6 }}>
                  {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {grouped[date]
                    .slice()
                    .sort((a, b) => (a.dueTime || '').localeCompare(b.dueTime || ''))
                    .map(task => (
                      <li key={task.id} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ color: task.completed ? '#bbb' : '#5ff281', fontWeight: 600, minWidth: 80 }}>
                          {task.dueTime ? task.dueTime : '--:--'}
                        </span>
                        <span style={{ textDecoration: task.completed ? 'line-through' : 'none', color: task.completed ? '#888' : '#f3f3f3', fontWeight: 500 }}>
                          {task.title}
                        </span>
                        {task.completed && <span style={{ color: '#5ff281', fontSize: '0.95em', marginLeft: 6 }}>(Done)</span>}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderAnalyticsView = () => {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.length - completed;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <h2 style={{ color: '#5ff281', marginBottom: 10 }}>Stats</h2>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          <div style={{ background: '#18182a', borderRadius: 10, padding: '18px 28px', minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #0002' }}>
            <div style={{ fontSize: '1.1em', color: '#bbb', marginBottom: 4 }}>Total Tasks</div>
            <div style={{ fontSize: '2.1em', fontWeight: 700, color: '#5ff281' }}>{tasks.length}</div>
          </div>
          <div style={{ background: '#18182a', borderRadius: 10, padding: '18px 28px', minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #0002' }}>
            <div style={{ fontSize: '1.1em', color: '#bbb', marginBottom: 4 }}>Completed</div>
            <div style={{ fontSize: '2.1em', fontWeight: 700, color: '#3fdc6b' }}>{completed}</div>
          </div>
          <div style={{ background: '#18182a', borderRadius: 10, padding: '18px 28px', minWidth: 120, textAlign: 'center', boxShadow: '0 2px 8px #0002' }}>
            <div style={{ fontSize: '1.1em', color: '#bbb', marginBottom: 4 }}>Pending</div>
            <div style={{ fontSize: '2.1em', fontWeight: 700, color: '#f3f3f3' }}>{pending}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app-minimal">
      <h1 style={{ fontSize: '2rem', marginBottom: 12, textAlign: 'center' }}>Student Task Manager</h1>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 18 }}>
        <button onClick={() => setView('list')}>List</button>
        <button onClick={() => setView('calendar')}>Calendar</button>
        <button onClick={() => setView('analytics')}>Stats</button>
      </div>
      <div style={{ background: '#23234a', padding: 12, borderRadius: 8, marginBottom: 18 }}>
        <h3 style={{ marginBottom: 8 }}>{editingId ? 'Edit Task' : 'Add Task'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            type="text"
            placeholder="Title"
            value={form.title || ''}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            style={{ fontSize: '1.4em', fontWeight: 700, padding: '0.6em 1em', minHeight: 40 }}
          />
          <textarea
            placeholder="Description"
            value={form.description || ''}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            style={{ minHeight: 70, fontSize: '1em', padding: '0.7em 1em', resize: 'vertical', borderRadius: 5, border: '1px solid #444', background: '#18182a', color: '#f3f3f3' }}
          />
          <button
            type="button"
            style={{ alignSelf: 'flex-start', background: showDue ? '#3fdc6b' : '#23234a', color: showDue ? '#18182a' : '#5ff281', border: '1px solid #5ff281', marginBottom: 0 }}
            onClick={() => {
              if (!showDue) {
                // Opening: set default dueDate to today and dueTime to now + 1 hour
                const now = new Date();
                now.setHours(now.getHours() + 1);
                const yyyy = now.getFullYear();
                const mm = String(now.getMonth() + 1).padStart(2, '0');
                const dd = String(now.getDate()).padStart(2, '0');
                const hh = String(now.getHours()).padStart(2, '0');
                const min = String(now.getMinutes()).padStart(2, '0');
                setForm(f => ({ ...f, dueDate: `${yyyy}-${mm}-${dd}`, dueTime: `${hh}:${min}` }));
              } else {
                // Hiding: clear dueDate and dueTime
                setForm(f => ({ ...f, dueDate: undefined, dueTime: undefined }));
              }
              setShowDue(v => !v);
            }}
          >
            {showDue ? 'Remove due date' : 'Add due date'}
          </button>
          {showDue && (
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <input
                type="date"
                value={form.dueDate || ''}
                max="2099-12-31"
                onChange={e => {
                  const val = e.target.value;
                  const year = val ? Number(val.split('-')[0]) : 0;
                  if (year >= 2100) return;
                  setForm(f => ({ ...f, dueDate: val }));
                }}
                style={{ flex: 1.5, minWidth: 160 }}
                placeholder="Due date (optional)"
              />
              <input
                type="time"
                value={form.dueTime || ''}
                onChange={e => setForm(f => ({ ...f, dueTime: e.target.value }))}
                style={{ flex: 1, minWidth: 100, background: '#18182a', color: '#f3f3f3', border: '1px solid #444', borderRadius: 5, padding: '0.4em 0.8em', fontSize: '1em' }}
                placeholder="Due time (optional)"
              />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            {editingId ? (
              <>
                <button onClick={updateTask}>Update</button>
                <button onClick={() => { setEditingId(null); setForm({}); }}>Cancel</button>
              </>
            ) : (
              <button onClick={addTask}>Add</button>
            )}
          </div>
        </div>
      </div>
      <div style={{ background: '#23234a', padding: 12, borderRadius: 8 }}>
        {view === 'list' && renderListView()}
        {view === 'calendar' && renderCalendarView()}
        {view === 'analytics' && renderAnalyticsView()}
      </div>
    </div>
  );
}

export default App;