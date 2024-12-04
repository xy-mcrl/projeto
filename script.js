const projetos = [];

function logout() {
    // Ocultar o cabeçalho e o container principal
    document.getElementById('main-header').style.display = 'none';
    document.getElementById('main-container').style.display = 'none';
    
    // Mostrar a tela de login
    document.querySelector('.login-card').style.display = 'block';
}


function showTab(tabId) {
    const cards = document.querySelectorAll('.card');
    const tabs = document.querySelectorAll('.tab');

    cards.forEach(card => {
        card.classList.remove('active');
    });
    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    document.getElementById(tabId).classList.add('active');
    document.querySelector(`.tab:contains('${tabId.replace('-', ' ')}')`).classList.add('active');
}

function toggleForm() {
    const loginCard = document.querySelector('.login-card');
    const registerCard = document.querySelector('.register-card');
    if (loginCard.style.display === 'none') {
        loginCard.style.display = 'block';
        registerCard.style.display = 'none';
    } else {
        loginCard.style.display = 'none';
        registerCard.style.display = 'block';
    }
}

function showMain() {
    document.querySelector('.login-card').style.display = 'none';
    document.querySelector('.register-card').style.display = 'none';
    document.getElementById('main-header').style.display = 'block';
    document.getElementById('main-container').style.display = 'block';
}

function login(event) {
    event.preventDefault();
    // Simulação de login bem-sucedido
    showMain();
}

function registerProject(event) {
    event.preventDefault();
    const projectName = document.getElementById('project-name').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const status = document.getElementById('project-status').value;

    const newProject = { nome: projectName, dataInicio: startDate, dataFim: endDate, status: status, tarefas: [] };
    projetos.push(newProject);
    updateProjectList();
    event.target.reset(); // Limpa o formulário após o envio
}

function updateProjectList() {
    const projectList = document.getElementById('project-list');
    projectList.innerHTML = ''; // Limpa a lista de projetos

    projetos.forEach(project => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${project.nome}</td>
            <td>${project.status}</td>
            <td>${project.dataInicio ? formatDate(project.dataInicio) : 'Não definida'}</td> <!-- Formatar Data de Início -->
            <td>${project.dataFim ? formatDate(project.dataFim) : 'Não definida'}</td>    <!-- Formatar Data de Fim -->
            <td>
                <button onclick="viewTasks('${project.nome}')">Ver Tarefas</button>
                <button onclick="deleteProject('${project.nome}')">Excluir</button>
            </td>
        `;
        projectList.appendChild(row);
    });

    updateProjectSelect();
}


function updateProjectSelect() {
    const projectSelect = document.getElementById('project-select');
    projectSelect.innerHTML = '<option value="">Selecione um projeto</option>'; // Reseta as opções

    projetos.forEach(project => {
        const option = document.createElement('option');
        option.value = project.nome;
        option.textContent = project.nome;
        projectSelect.appendChild(option);
    });
}

function deleteProject(projectName) {
    const projectIndex = projetos.findIndex(p => p.nome === projectName);
    if (projectIndex > -1) {
        projetos.splice(projectIndex, 1);
        updateProjectList();
    }
}

function registerTask(event) {
    event.preventDefault();
    const taskName = document.getElementById('task-name').value;
    const taskStatus = document.getElementById('task-status').value;
    const taskStartDate = document.getElementById('task-start-date').value;
    const taskEndDate = document.getElementById('task-end-date').value;
    const projectName = document.getElementById('project-select').value;

    const project = projetos.find(p => p.nome === projectName);
    if (project) {
        const newTask = { nome: taskName, status: taskStatus, dataInicio: taskStartDate, dataFim: taskEndDate };
        project.tarefas.push(newTask);
        updateProjectList();
        event.target.reset(); // Limpa o formulário após o envio
        alert('Tarefa cadastrada com sucesso!');
    } else {
        alert('Projeto não encontrado.');
    }
}

function viewTasks(projectName) {
    const project = projetos.find(p => p.nome === projectName);
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    const tarefas = project?.tarefas || [];
    if (tarefas.length > 0) {
        tarefas.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.nome}</td>
                <td>${task.status}</td>
                <td>${task.dataInicio ? formatDate(task.dataInicio) : 'Não definida'}</td> <!-- Formatar Data de Início da tarefa -->
                <td>${task.dataFim ? formatDate(task.dataFim) : 'Não definida'}</td>    <!-- Formatar Data de Fim da tarefa -->
                <td>
                    <button onclick="editTask('${projectName}', '${task.nome}')">Editar</button>
                    <button onclick="deleteTask('${projectName}', '${task.nome}')">Excluir</button>
                </td>
            `;
            taskList.appendChild(row);
        });
        showTab('project-tasks'); // Exibe a aba de tarefas apenas se houver tarefas
    } else {
        alert('Nenhuma tarefa cadastrada para este projeto.');
    }
}


function deleteTask(projectName, taskName) {
    const project = projetos.find(p => p.nome === projectName);
    if (project) {
        const taskIndex = project.tarefas.findIndex(t => t.nome === taskName);
        if (taskIndex > -1) {
            // Remove a tarefa do projeto
            project.tarefas.splice(taskIndex, 1);
            // Atualiza a lista de tarefas na interface
            updateTaskList(projectName);
        } else {
            alert('Tarefa não encontrada.');
        }
    } else {
        alert('Projeto não encontrado.');
    }
}

function updateTaskList(projectName) {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    const tarefas = projetos.find(p => p.nome === projectName)?.tarefas || [];
    if (tarefas.length > 0) {
        tarefas.forEach(task => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${task.nome}</td>
                <td>${task.status}</td>
                <td>
                    <button onclick="editTask('${projectName}', '${task.nome}')">Editar</button>
                    <button onclick="deleteTask('${projectName}', '${task.nome}')">Excluir</button>
                </td>
            `;
            taskList.appendChild(row);
        });
    } else {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="3">Nenhuma tarefa encontrada.</td>`;
        taskList.appendChild(row);
    }
}

function editTask(projectName, taskName) {
    const project = projetos.find(p => p.nome === projectName);
    const task = project?.tarefas.find(t => t.nome === taskName);
    if (task) {
        document.getElementById('edit-task-name').value = task.nome;
        document.getElementById('edit-task-status').value = task.status;
        document.getElementById('edit-task-start-date').value = task.dataInicio;
        document.getElementById('edit-task-end-date').value = task.dataFim;
        editProjectName = projectName;
        editTaskName = taskName;
        document.getElementById('edit-modal').style.display = 'flex'; // Exibe o modal
    }
}

function saveTaskEdit(event) {
    event.preventDefault(); // Previne o envio do formulário

    const project = projetos.find(p => p.nome === editProjectName);
    const task = project?.tarefas.find(t => t.nome === editTaskName);
    if (task) {
        task.nome = document.getElementById('edit-task-name').value;
        task.status = document.getElementById('edit-task-status').value;
        task.dataInicio = document.getElementById('edit-task-start-date').value;
        task.dataFim = document.getElementById('edit-task-end-date').value;
        
        closeModal(); // Fecha o modal de edição

        viewTasks(editProjectName); // Atualiza a lista de tarefas para refletir as mudanças
    }
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none'; // Oculta o modal
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

