// P A T H S
// by Isayama

type Mode = "edit" | "play";
const newSongID = "new";

export class RootPath {
    URL(): string {
        return "/";
    }
}
export const rootPath = new RootPath();

export class AboutPath {
    URL(): string {
        return "/about";
    }
}
export const aboutPath = new AboutPath();

export class GuitarDemoPath {
    URL(): string {
        return "/guitar-demo";
    }
}

export const guitarDemoPath = new GuitarDemoPath();

export class SongPath {
    URL(): string {
        return "/song";
    }

    withID(id: string): SongIDPath {
        return new SongIDPath(id);
    }

    withNew(): SongIDPath {
        return new SongIDPath(newSongID);
    }
}
export const songPath = new SongPath();

export class SongIDPath {
    private readonly id: string;

    constructor(id: string) {
        this.id = id;
    }
    URL(): string {
        return `/song/${this.id}`;
    }

    isNew(): boolean {
        return this.id === newSongID;
    }

    withMode(mode: Mode): SongIDModePath {
        return new SongIDModePath(this.id, mode);
    }

    parent(): SongPath {
        return songPath;
    }
}
export const newSongPath = songPath.withNew();

export class SongIDModePath {
    private readonly id: string;
    private readonly mode: Mode;
    constructor(id: string, mode: Mode) {
        this.id = id;
        this.mode = mode;
    }
    URL(): string {
        return `/song/${this.id}/${this.mode}`;
    }

    parent(): SongIDPath {
        return new SongIDPath(this.id);
    }

    static isPlayMode(path: string): boolean {
        const result = path.match(/\/song\/.+\/play/i);
        return result !== null;
    }

    static isEditMode(path: string): boolean {
        const result = path.match(/\/song\/.+\/edit/i);
        return result !== null;
    }
}

export class DemoPath {
    URL(): string {
        const neverGonnaGiveYouPlasticLoveUUID =
            "c531c0fe-6e8d-4cfe-9c5f-120e3402ccd9";

        return new SongIDPath(neverGonnaGiveYouPlasticLoveUUID).URL();
    }
}
export const demoPath = new DemoPath();
