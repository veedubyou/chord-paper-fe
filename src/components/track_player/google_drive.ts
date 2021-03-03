const googleDriveExportLinkRegex= new RegExp(`.*drive.google.com/.*?.+`)

export const isGoogleDriveExportLink = (url: string): boolean => {
    const results = url.match(googleDriveExportLinkRegex);
    return results !== null;
}

export const addCacheBuster = (url: string, randID: string): string => {
    return url + "&cacheBuster=" + randID;
}
