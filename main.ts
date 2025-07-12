import { Plugin, moment } from "obsidian";
import { debounce } from "lodash";
import {
  DEFAULT_SETTINGS,
  SettingsTab,
  ObsidianTRMNLUpdaterSettings,
} from "settings";

export default class ObsidianTRMNLUpdater extends Plugin {
  settings: ObsidianTRMNLUpdaterSettings;
  exportFunction: () => void;

  async onload() {
    console.log("Loading Obsidian TRMNL Updater");
    console.log("exportFunction", this.exportFunction);
    console.log("yes yes yes z");

    await this.loadSettings();

    this.registerEvent(this.app.vault.on("modify", this._export, this));
    this.registerEvent(this.app.vault.on("delete", this._export, this));

    this.addSettingTab(new SettingsTab(this.app, this));

    this._export();
  }

  onunload() {
    this._export();
  }

  async _export() {
    const file =
      this.app.vault.getFileByPath("export.json") ||
      (await this.app.vault.create("export.json", ""));
    const data = {
      tasks: await this._tasks(),
      habits: await this._habits(),
      eventsToday: await this._eventsToday(),
      dailyNote: this._dailyNote(),
    };

    this.app.vault.process(file, () => {
      return JSON.stringify(data);
    });
  }

  async _tasks() {
    const dv = this.app.plugins.plugins.dataview.api;

    const result = await dv.query("TASK");
    const allTasks = result.value.values
      .filter((task: any) => !task.tags.includes("#habit"))
      .filter(
        (task: any) =>
          !task.completed ||
          (task.completion &&
            moment(task.completion.ts).isSame(moment().startOf("day"))),
      );

    return allTasks.map((task: any) => {
      return {
        checked: task.checked,
        completed: task.completed,
        fullyCompleted: task.fullyCompleted,
        status: task.status,
        text: task.text,
      };
    });
  }

  async _habits() {
    return "TODO";
  }

  async _eventsToday() {
    return "TODO";
  }

  async _dailyNote() {
    return "TODO";
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
