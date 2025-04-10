import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  type DocumentData,
  CollectionReference,
  setDoc,
} from "firebase/firestore";
interface FirestoreHelper {
  getAll: () => Promise<DocumentData[]>;
  getOne: (id: string) => Promise<DocumentData>;
  create: (data: DocumentData, customId: string) => Promise<string>;
  update: (id: string, data: DocumentData) => Promise<void>;
  remove: (id: string) => Promise<void>;
}
const useFirestoreHelper = (
  collectionName: string,
  parentId?: string,
  subCollectionName?: string
): FirestoreHelper => {
  const db = useFirestore();
  let colRef: CollectionReference<DocumentData>;
  if (parentId && subCollectionName) {
    colRef = collection(
      db,
      `${collectionName}/${parentId}/${subCollectionName}`
    );
  } else {
    colRef = collection(db, collectionName);
  }

  return {
    async getAll() {
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    },

    async getOne(id: string) {
      const docRef = doc(db, colRef.path, id);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() };
      } else {
        throw new Error("Document not found");
      }
    },

    async create(data: DocumentData, customId?: string) {
      if (customId) {
        const docRef = doc(colRef, customId);
        await setDoc(docRef, data);
        return customId;
      } else {
        const docRef = await addDoc(colRef, data);
        return docRef.id;
      }
    },

    async update(id: string, data: DocumentData) {
      const docRef = doc(db, colRef.path, id);
      await updateDoc(docRef, data);
    },

    async remove(id: string) {
      const docRef = doc(db, colRef.path, id);
      await deleteDoc(docRef);
    },
  };
};

export default useFirestoreHelper;
