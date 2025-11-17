import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Conexão com o banco (vamos usar em várias funções)
let db;

async function initDatabase() {
    db = await open({
        filename: './banco.db',
        driver: sqlite3.Database,
    });

    // Criar tabela com nível de urgência
    await db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            task TEXT NOT NULL,
            urgency_level TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
}

// Função para adicionar task
async function addTask(taskText, urgencyLevel) {
    try {
        const result = await db.run(
            'INSERT INTO tasks (task, urgency_level) VALUES (?, ?)',
            [taskText, urgencyLevel]
        );
        console.log('Task adicionada com ID:', result.lastID);
        return result.lastID;
    } catch (error) {
        console.error('Erro ao adicionar task:', error);
    }
}

// Função para buscar todas as tasks
async function getAllTasks() {
    try {
        const tasks = await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
        return tasks;
    } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        return [];
    }
}

// Função para deletar task
async function deleteTask(taskId) {
    try {
        await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
        console.log('Task deletada:', taskId);
    } catch (error) {
        console.error('Erro ao deletar task:', error);
    }
}

// Inicializar o banco
initDatabase();

// Exportar as funções para usar no frontend
export { addTask, getAllTasks, deleteTask };