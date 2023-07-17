import * as TauriFS from "@tauri-apps/api/fs";
import * as TauriPath from "@tauri-apps/api/path";

export default class Persistor<Data extends Record<string, unknown>> {
  private _filename: string;
  private _defaultData: Data;
  private _validate: (maybeData: unknown) => Data;

  private _data: Data;
  public get data() {
    return this._data;
  }

  constructor(
    filename: string,
    defaultData: Data,
    validate: (maybeData: unknown) => Data
  ) {
    this._filename = filename;
    this._defaultData = defaultData;
    this._validate = validate;

    this._data = defaultData;
  }

  load = async (): Promise<void> => {
    this._data = this._defaultData;
    try {
      const dataDirPath = await TauriPath.appDataDir();
      const dataPath = await TauriPath.join(dataDirPath, this._filename);

      const dataExists = await TauriFS.exists(dataPath);
      if (!dataExists) return;

      const maybeData = JSON.parse(await TauriFS.readTextFile(dataPath));
      this._data = this._validate(maybeData);
    } catch (e) {
      console.log(e);
    }
  };

  save = async (): Promise<void> => {
    try {
      const dataDirPath = await TauriPath.appDataDir();
      const dataPath = await TauriPath.join(dataDirPath, this._filename);

      if (!(await TauriFS.exists(dataDirPath)))
        await TauriFS.createDir(dataDirPath, { recursive: true });
      await TauriFS.writeTextFile(dataPath, JSON.stringify(this.data));
    } catch (e) {
      console.log(e);
      // Ignore.
    }
  };
}
