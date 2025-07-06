import { Plugin  } from 'obsidian';
import { moment } from 'obsidian';


export default class ObsidianAutoExporter extends Plugin {

	async onload() {
		console.log('Loading Obsidian Auto Exporter')
		this.registerEvent(this.app.vault.on("modify", this._export, this));
		this.registerEvent(this.app.vault.on("delete", this._export, this));

		this._export()
	}

	onunload() {}

	async _export() {
		const file = await this.app.vault.getFileByPath('export.json') || await this.app.vault.create('export.json', '')
		const data = { tasks: await this._tasks(), habits: await this._habits(), eventsToday: await this._eventsToday(), dailyNote: this._dailyNote() }

		this.app.vault.process(file, () => { return JSON.stringify(data); });
	}

	async _tasks() {
		const dv = this.app.plugins.plugins.dataview.api

		const result = await dv.query('TASK')
		const allTasks = result.value.values.filter((task) => !task.tags.includes('#habit')).filter((task) => !task.completed || (task.completion && moment(task.completion.ts).isSame(moment().startOf('day')))  )

		return allTasks.map((task: any) => { return { checked: task.checked, completed: task.completed, fullyCompleted: task.fullyCompleted, status: task.status, text: task.text } })
	}

	async _habits() {
		return 'TODO'
	}

	async _eventsToday() {
		return 'TODO'
	}

	async _dailyNote() {
		return 'TODO'
	}
}
