const form = document.querySelector("form")
form.addEventListener('submit', function(e) {
    e.preventDefault();
    alert("Selecione um nivel de urgência");
});

// Funções que criam e salvam no banco
async function green() {
    await addTaskWithLevel('green');
}

async function yellow() {
    await addTaskWithLevel('yellow');
}

async function red() {
    await addTaskWithLevel('red');
}

// Função para adicionar task (comunica com o servidor)
async function addTaskWithLevel(urgencyLevel) {
    const input = document.querySelector('input');
    const valueInput = input.value.trim();
    
    if (valueInput === '') {
        alert('Insira uma Tarefa');
        return;
    }

    try {
        console.log('📤 Enviando task:', valueInput, 'Nível:', urgencyLevel);
        
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                task: valueInput,
                urgency_level: urgencyLevel
            })
        });

        console.log('📥 Resposta do servidor:', response.status);

        if (response.ok) {
            const newTask = await response.json();
            console.log('✅ Task criada com ID:', newTask.id);
            
            // Agora sim, adiciona na interface
            addTaskToUI(valueInput, urgencyLevel, newTask.id);
            input.value = '';
        } else {
            const error = await response.json();
            console.error('❌ Erro do servidor:', error);
            alert('Erro ao salvar task: ' + error.error);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// Função para adicionar task na interface
function addTaskToUI(taskText, urgencyLevel, taskId) {
    let li = document.createElement('li');
    li.dataset.id = taskId; // Salva o ID do banco
    li.innerHTML = `
        <span class="task-text">${taskText}</span>
        <span class="delete" onclick="deleteTaskFromDB(this)">🗑️</span>
    `;
    document.getElementById(urgencyLevel).appendChild(li);
}

// Função para deletar do banco (ATUALIZADA)
async function deleteTaskFromDB(element) {
    const li = element.parentElement;
    const taskId = li.dataset.id;

    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            li.remove();
        } else {
            alert('Erro ao deletar task');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao conectar com o servidor');
    }
}

// Carregar tasks ao abrir a página
async function loadTasks() {
    try {
        const response = await fetch('/api/tasks');
        const tasks = await response.json();
        
        console.log('📦 Tasks carregadas do banco:', tasks);
        
        tasks.forEach(task => {
            addTaskToUI(task.task, task.urgency_level, task.id);
        });
    } catch (error) {
        console.error('Erro ao carregar tasks:', error);
    }
}

// Carrega as tasks quando a página abre
document.addEventListener('DOMContentLoaded', loadTasks);