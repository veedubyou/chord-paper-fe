const googleDriveExportLinkRegex = new RegExp(`.*drive.google.com/.*?.+`);
const googleDriveViewerLinkRegex = new RegExp(
    `.*drive.google.com/file/d/(.+)/.*`
);

const isGoogleDriveExportLink = (url: string): boolean => {
    const results = url.match(googleDriveExportLinkRegex);
    return results !== null;
};

export const ensureGoogleDriveCacheBusted = (
    url: string,
    randID: string
): string => {
    if (!isGoogleDriveExportLink(url)) {
        return url;
    }

    return url + "&cacheBuster=" + randID;
};

export const convertViewLinkToExportLink = (url: string): string | null => {
    const results = url.match(googleDriveViewerLinkRegex);
    if (results === null) {
        return null;
    }

    if (results.length < 2) {
        return null;
    }

    const fileID = results[1];

    return "https://drive.google.com/uc?export=download&id=" + fileID;
};
