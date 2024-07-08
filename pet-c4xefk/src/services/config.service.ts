import fs from 'fs';
import os from 'os';
import path from '../core/path';
import { Config } from '../models/config';
import packageJson from '../../package.json'
import { DialogService } from './dialog.service';

export class ConfigService {

    private _getAppDataDirectory(): string {
        let appDataPath;
        if (process.platform === 'win32') {
            appDataPath = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
        } else if (process.platform === 'darwin') {
            appDataPath = path.join(os.homedir(), 'Library', 'Application Support');
        } else if (process.platform === 'linux') {
            appDataPath = path.join(os.homedir(), '.config');
        } else {
            appDataPath = os.homedir();
        }

        return path.join(appDataPath, packageJson.name);
    }

    private _getAppDataConfigFile(): string {
        const appDataDirectory = this._getAppDataDirectory()
        return path.join(appDataDirectory, "config.json");
    }

    checkConfigFile(): void {
        if (!fs.existsSync(this._getAppDataDirectory())) {
            fs.mkdirSync(this._getAppDataDirectory());
        }
        if (!fs.existsSync(this._getAppDataConfigFile())) {
            fs.writeFileSync(this._getAppDataConfigFile(), JSON.stringify(new Config()), { encoding: 'utf-8' });
        }
    }

    getConfig(): Config {
        try {
            const configFile = fs.readFileSync(this._getAppDataConfigFile(), { encoding: 'utf-8' });
            const config: Config = JSON.parse(configFile);
            return config;
        } catch (err) {
            console.error("Error reading config file", err);
        }
    }

    saveConfig(config: Config): void {
        try {
            fs.writeFileSync(this._getAppDataConfigFile(), JSON.stringify(config), { encoding: 'utf-8' });
        } catch (err) {
            console.error("Error saving config file", err);
        }
    }

    saveConfigHandle() {
        this.saveConfig({
            contentPath: (document.getElementById('contentPath') as HTMLInputElement).value,
            cycle: (document.getElementById('cycle') as HTMLInputElement).value,
            lob: (document.getElementById('lob') as HTMLInputElement).value,
        })
    }
    editConfigHandle(): void {
        const config = this.getConfig();
        const dialogService = new DialogService();
        dialogService.setTitle("Edit Config");
        let content = `<div class="form-group"> <label for="contentPath">Content path:</label><input class="form-control" id="contentPath" type="text" name="contentPath" value="${config.contentPath}" /></div>`
        content += `<div class="form-group"> <label for="lob">LOB:</label><input class="form-control" id="lob" type="text" name="lob" value="${config.lob}" /></div>`
        content += `<div class="form-group"> <label for="cycle">Cycle:</label><input class="form-control" id="cycle" type="text" name="cycle" value="${config.cycle}" /></div>`
        content += `<div><button type="button" id="cancelConfig">Cancel</button><button type="button" id="saveConfig">Save</button></div>`       
        dialogService.setContent(content);
        dialogService.show();
        document.getElementById('cancelConfig')?.addEventListener('click', () => {
            dialogService.hide();
        })
        document.getElementById('saveConfig')?.addEventListener('click', () => {
            this.saveConfigHandle();
            dialogService.hide();
        });
    }

}