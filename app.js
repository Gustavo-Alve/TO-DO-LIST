import sqlite3 from 'sqlite3'; //importa o sqlite para usar como banco
import {open} from 'sqlite'; //importa a funçao abrir

async function createTables (task, date) {
    const db = await open ({
        filename : './banco.db',
        driver : sqlite3.Database,
    })

    //parte onde executo comanndo sql
    db.run ('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY, task TEXT, date DATETIME DEFAULT CURRENT_TIMESTAMP)');
    db.run ('INSERT INTO tasks (task, date) VALUES (?,?)',[ //esses (?,?) serve para segurança
        task,
        date,
    ]);
    db.run ('DELETE FROM tasks')
}

createTables();