import { v4 as uuidv4 } from "uuid";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase/config";


function uniqueFilename(originalName: string) {
    const id = uuidv4();
    const ext = originalName.includes(".") ? originalName.substring(originalName.lastIndexOf(".")) : "";
    return `images/${Date.now()}_${id}${ext}`;
}

export default function uploadFile(file: File): Promise<{ url: string; filename: string }> {
    return new Promise((resolve, reject) => {
        const filename = uniqueFilename(file.name);
        const storageRef = ref(storage, filename);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            "state_changed",
            () => {
                // progress could be handled here
            },
            (err) => reject(err),
            async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve({ url, filename });
                } catch (err) {
                    reject(err);
                }
            }
        );
    });
}
