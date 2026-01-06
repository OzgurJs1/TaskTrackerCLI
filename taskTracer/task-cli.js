const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, 'tasks.json');

function loadTasks() {
    if (!fs.existsSync(FILE_PATH)) return [];
    try {
        const data = fs.readFileSync(FILE_PATH, 'utf-8');
        return data.trim() ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
}

function saveTasks(tasks) {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
}

const [, , command, ...args] = process.argv;

let tasks = loadTasks(); 

switch (command) {
    case 'add':
        const newID = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
        const newTask = {
            id: newID,
            description: args[0],
            status: 'todo',
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString()
        };
        tasks.push(newTask); 
        saveTasks(tasks);
        console.log(`Mission is added. (ID: ${newID})`);
        break;

    case 'update':
        const updateId = parseInt(args[0]);
        const newDesc = args[1];
        tasks = tasks.map(t => t.id === updateId ? { ...t, description: newDesc, updatedAt: new Date().toLocaleString() } : t);
        saveTasks(tasks);
        console.log(`Mission ${updateId} updated.`);
        break;

    case 'delete':
        const deleteId = parseInt(args[0]);
        tasks = tasks.filter(t => t.id !== deleteId);
        saveTasks(tasks);
        console.log(`Mission ${deleteId} deleted.`);
        break;

    case 'mark-in-progress':
        const progId = parseInt(args[0]);
        tasks = tasks.map(t => t.id === progId ? { ...t, status: 'in-progress', updatedAt: new Date().toLocaleString() } : t);
        saveTasks(tasks);
        console.log(`Task ${progId} is marked as ongoing.`);
        break;

    case 'mark-done':
        const doneId = parseInt(args[0]);
        tasks = tasks.map(t => t.id === doneId ? { ...t, status: 'done', updatedAt: new Date().toLocaleString() } : t);
        saveTasks(tasks);
        console.log(`Task ${doneId} has been marked as completed.`);
        break;

    case 'list':
        const filter = args[0];
        const filtered = filter ? tasks.filter(t => t.status === filter) : tasks;
        console.table(filtered);
        break;

    default:
        console.log("Usage: node task-cli.js add 'task name'");
}