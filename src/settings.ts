import { App, Setting, PluginSettingTab } from "obsidian";
import ObsidianExporter from "main";

export const DEFAULT_SETTINGS = {};

export interface ObsidianExporterSettings {
  trmnlWebhookUrl: string;
}

export class SettingsTab extends PluginSettingTab {
  plugin: ObsidianExporter;

  constructor(app: App, plugin: ObsidianExporter) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    new Setting(containerEl)
      .setName("TRMNL Webhook URL")
      .setDesc("Copy this value from the trmnl plugin page")
      .addText((text) =>
        text
          .setPlaceholder("https://usetrmnl.com/api/custom_plugins/xxxx")
          .setValue(this.plugin.settings.trmnlWebhookUrl)
          .onChange(async (value) => {
            this.plugin.settings.trmnlWebhookUrl = value;
            await this.plugin.saveSettings();
          }),
      );
  }
}
