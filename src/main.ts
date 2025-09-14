import { Plugin, moment } from "obsidian";
import _ from 'lodash';

import {
  DEFAULT_SETTINGS,
  SettingsTab,
  ObsidianExporterSettings,
} from "./settings";

import parseTime from "./parse_time"

export default class ObsidianExporter extends Plugin {
  settings: ObsidianExporterSettings;
  exportFunction: () => void;

  async onload() {
    console.log("loading Obsidian Exporter");

    await this.loadSettings();

    const debouncedExport = _.debounce(this._export, 10000)

    this.registerEvent(this.app.vault.on("modify", debouncedExport, this));
    this.registerEvent(this.app.vault.on("delete", debouncedExport, this));

    this.addSettingTab(new SettingsTab(this.app, this));

    this.app.workspace.onLayoutReady(async () => {
      this._export();
    })
  }

  onunload() {
    this._export();
  }

  async _export() {
    console.log('[Exporter] writing to export.json');

    const file =
      this.app.vault.getFileByPath("export.json") ||
      (await this.app.vault.create("export.json", ""));
    const data = {
      tasks: await this._tasks(),
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

    window.allTasks = allTasks // For debug !!!
    return allTasks.map((task: any) => {

      return {
        id: this._getId(task.text),
        checked: task.checked,
        completed: task.completed,
        due: task.due,
        fullyCompleted: task.fullyCompleted,
        scheduled: task.scheduled,
        status: task.status,
        tags: task.tags,
        text: task.text,
        time: parseTime(task.text)
      };
    });
  }

  _getId(text?: string): string | undefined {
    if (text && _.includes(text, '🆔')) {
      const matches = text.match(/🆔\s*(\S*)/)
      if (matches) { return matches[1] }

    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
