// P A T H S
// by Isayama

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

    withEditMode(): EditSongPath {
        return new EditSongPath(this.id);
    }

    withPlayMode(): PlaySongPath {
        return new PlaySongPath(this.id, "root");
    }

    parent(): SongPath {
        return songPath;
    }
}
export const newSongPath = songPath.withNew();

export class EditSongPath {
    private readonly id: string;
    constructor(id: string) {
        this.id = id;
    }

    URL(): string {
        return `/song/${this.id}/edit`;
    }

    parent(): SongIDPath {
        return new SongIDPath(this.id);
    }

    static isEditMode(path: string): boolean {
        const result = path.match(/\/song\/.+\/edit/i);
        return result !== null;
    }
}

export class PlaySongPath {
    private readonly id: string;
    private readonly mode: "page" | "scroll" | "root";

    constructor(id: string, mode: "page" | "scroll" | "root") {
        this.id = id;
        this.mode = mode;
    }

    URL(): string {
        const baseURL = `/song/${this.id}/play`;

        if (this.mode === "root") {
            return baseURL;
        }

        return `${baseURL}/${this.mode}`;
    }

    withPageView(): PlaySongPath {
        return new PlaySongPath(this.id, "page");
    }

    withScrollView(): PlaySongPath {
        return new PlaySongPath(this.id, "scroll");
    }

    parent(): SongIDPath {
        return new SongIDPath(this.id);
    }

    static isPlayMode(path: string): boolean {
        const result = path.match(/\/song\/.+\/play/i);
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
