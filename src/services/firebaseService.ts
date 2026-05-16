import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { EntityDiscovery } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Critical Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

function logFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore Non-Critical Error: ', JSON.stringify(errInfo));
}

export async function getEntities() {
  const path = 'entities';
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EntityDiscovery));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function cacheSearchInsight(searchQuery: string, insight: string) {
  const path = 'insights';
  const id = btoa(searchQuery).substring(0, 50); // Simple ID for query
  try {
    await setDoc(doc(db, path, id), {
      query: searchQuery,
      insight,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    logFirestoreError(error, OperationType.WRITE, `${path}/${id}`);
  }
}

export async function getCachedInsight(searchQuery: string) {
  const path = 'insights';
  const id = btoa(searchQuery).substring(0, 50);
  try {
    const docRef = doc(db, path, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().insight;
    }
    return null;
  } catch (error) {
    logFirestoreError(error, OperationType.GET, `${path}/${id}`);
    return null;
  }
}
