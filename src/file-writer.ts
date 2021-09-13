import fs from "fs";

export async function WriteFile(outputPath: string, removeOld: boolean, text: string) {
    if (removeOld) {
        await new Promise<void>((resolve, reject) => {
            fs.unlink(outputPath, () => {
                resolve();
            });
        });
    }
    await new Promise<void>((resolve, reject) => {
        fs.writeFile(outputPath, text, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}
