import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

// Para usar __dirname com ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Variável para o banco de dados
let db;

// Inicializar banco de dados
async function initDatabase() {
    try {
        db = await open({
            filename: path.join(__dirname, 'banco.db'),
            driver: sqlite3.Database
        });

        // Criar tabela se não existir
        await db.run(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                task TEXT NOT NULL,
                urgency_level TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Banco de dados inicializado!');
    } catch (error) {
        console.error('❌ Erro ao inicializar banco:', error);
    }
}

// Rotas da API

// Buscar todas as tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.all('SELECT * FROM tasks ORDER BY created_at DESC');
        res.json(tasks);
    } catch (error) {
        console.error('Erro ao buscar tasks:', error);
        res.status(500).json({ error: 'Erro ao buscar tasks' });
    }
});

// Adicionar nova task
app.post('/api/tasks', async (req, res) => {
    try {
        const { task, urgency_level } = req.body;
        
        if (!task || !urgency_level) {
            return res.status(400).json({ error: 'Task e nível de urgência são obrigatórios' });
        }

        const result = await db.run(
            'INSERT INTO tasks (task, urgency_level) VALUES (?, ?)',
            [task, urgency_level]
        );

        res.json({ 
            id: result.lastID, 
            task, 
            urgency_level,
            message: 'Task adicionada com sucesso!' 
        });
    } catch (error) {
        console.error('Erro ao adicionar task:', error);
        res.status(500).json({ error: 'Erro ao adicionar task' });
    }
});

// Deletar task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const taskId = req.params.id;
        await db.run('DELETE FROM tasks WHERE id = ?', [taskId]);
        res.json({ message: 'Task deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar task:', error);
        res.status(500).json({ error: 'Erro ao deletar task' });
    }
});

// Rota de teste
app.get('/api/test', (req, res) => {
    res.json({ 
        message: '✅ API está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota para a página principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicializar servidor
async function startServer() {
    await initDatabase();
    
    app.listen(PORT, () => {
        console.log('🎉 Servidor rodando!');
        console.log(`📍 URL: http://localhost:${PORT}`);
        console.log(`📡 API Test: http://localhost:${PORT}/api/test`);
        console.log(`🌐 Frontend: http://localhost:${PORT}`);
    });
}

// Iniciar o servidor
startServer().catch(console.error);