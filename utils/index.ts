import { Timestamp } from "firebase/firestore";


// format Firebase Timestamp to readable string
export function formatTimestamp(timestamp: Timestamp | null | undefined) {
    if (!timestamp) return null;
    try {
        const date = timestamp.toDate() //.toLocaleString();
        return date
    } catch {
        return null;
    }
}
