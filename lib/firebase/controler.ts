import { formatTimestamp } from "@/utils";
import { db } from "./config";
import {
    collection,
    addDoc,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    updateDoc,
    serverTimestamp,
    getDoc,
    DocumentData,
    DocumentSnapshot,
} from "firebase/firestore";

type DOC_NAME = "products" | "categories" | "orders" | "users";


const formatData = (snap: DocumentSnapshot<DocumentData, DocumentData>) => {
    const getData = snap.data();

    return {
        id: snap.id,
        ...getData,
        createdAt: formatTimestamp(getData?.createdAt),
        updatedAt: formatTimestamp(getData?.updatedAt)
    }
}

const Controller = {
    async createData<T,>(DOC_NAME: DOC_NAME, data: unknown) {
        const getData = data as T;                

        // product is an object already prepared
        const colRef = collection(db, DOC_NAME);
        const docRef = await addDoc(colRef, {
            ...getData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        
        return docRef.id;
    },
    async updateData<T,>(DOC_NAME: DOC_NAME, id: string, data: unknown) {
        const getData = data as T;

        const docRef = doc(db, DOC_NAME, id);
        await updateDoc(docRef, { ...getData, updatedAt: serverTimestamp() });
    },
    async getData<T,>(DOC_NAME: DOC_NAME, id: string) {
        const docRef = doc(db, DOC_NAME, id);
        const snap = await getDoc(docRef);

        return formatData(snap) as T;
    },
    async getAllData<T,>(DOC_NAME: DOC_NAME,) {
        const colRef = collection(db, DOC_NAME);
        const snap = await getDocs(colRef);

        return snap.docs.map((d) => formatData(d)) as T[];
    },
    async deleteData(DOC_NAME: DOC_NAME, id: string) {
        const docRef = doc(db, DOC_NAME, id);
        await deleteDoc(docRef);
        return true;
    }
};

export default Controller;