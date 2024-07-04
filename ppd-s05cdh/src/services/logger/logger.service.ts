import { sleep } from "../../core/helpers";

export class LoggerService {
    static tasks: string[]
    static currentTask: number;

    static async clearTasks(): Promise<void> {
        this.tasks = []
        this.currentTask = 0;
        document.getElementById('task').innerText = ""
        document.getElementById('taskLogger').innerText = "";
    }

    static async setLog(log: string): Promise<void> {
        await sleep(.5);
        console.log("TaskLogger:", log)
        document.getElementById('taskLogger').innerText = log;
    }

    static async setTasks(tasks: string[]): Promise<void> {
        if (tasks.length > 0) {
            this.tasks = tasks;
            this.currentTask = 0;
            await sleep(1);
            document.getElementById('task').innerText = `[${this.currentTask + 1}/${this.tasks.length}] ${this.tasks[0]}`
            document.getElementById('taskLogger').innerText = "";
        }
    }

    static async displayNextTask(): Promise<void> {
        const nextTaskN = this.currentTask + 1;
        if (nextTaskN < this.tasks.length) {
            await sleep(1);
            this.currentTask = nextTaskN;
            const task = this.tasks[this.currentTask];
            console.log("Task:", task)
            document.getElementById('task').innerText = `[${this.currentTask + 1}/${this.tasks.length}] ${task}`;
            document.getElementById('taskLogger').innerText = "";
        } else {
            console.log("Completed tasks")
            document.getElementById('task').innerText = "Completed tasks."
            document.getElementById('taskLogger').innerText = "";
        }
    }


}