import useSWR from 'swr';
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { onSnapshot } from 'firebase/firestore';

export interface PerpMetadata {
	ticker: string;
	description: string;
	title: string;
	createdAt: string | Date | null | undefined;
	author: string;
}

// Type definitions
export interface SimplePerp {
  id: string;
  fundingRate: string;
  perpSmartContractAddress: string;
  markPrice: string;
  netOpenInterest: string;
  totalOpenInterest: string;
  lastFundingUpdate: string;
  cumulativeFunding: string;
  totalPositions?: string;
  mockedTimestamp: string;
  metadata: PerpMetadata;

}

export interface Position {
  id: string;
  holder: string;
  collateral: string;
  quantity: string;
  leverage: string;
  entryPrice: string;
  entryCumulativeFunding: string;
  isOpen: boolean;
  simplePerpId: string;
  mockedTimestamp: string;
}

export interface MarketUpdate {
  id: string;
  fundingRate: string;
  markPrice: string;
  netOI: string;
  totalOI: string;
  simplePerpId: string;
  mockedTimestamp: string;
}

// Add this new interface
export interface SimplePerpWithDelta extends SimplePerp {
  previousMarkPrice?: string;
  delta?: number;
  lastUpdateTime?: number;
}

// Function to get raw data from Firebase
export async function getRawFirebaseData(path: string) {
  try {
    const docRef = doc(db, path);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.log(`No document found at path: ${path}`);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching document at path ${path}:`, error);
    throw error;
  }
}

// Function to get raw collection data from Firebase
export async function getRawFirebaseCollectionData(path: string) {
  try {
    const collectionRef = collection(db, path);
    const querySnapshot = await getDocs(collectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Error fetching collection at path ${path}:`, error);
    throw error;
  }
}

// Fetcher function for a single document
const fetchDocument = async (path: string) => {
  return getRawFirebaseData(path);
};

// Fetcher function for a collection
const fetchCollection = async <T>(path: string) => {
  const data = await getRawFirebaseCollectionData(path);
  return data as T[];
};

// Hook for fetching a single document
export function useDocument<T>(path: string) {
  const { data, error, mutate } = useSWR<T | null, Error>(
    path,
    null,
    {
      refreshInterval: 0,
      fetcher: (path: string) => {
        return new Promise((resolve, reject) => {
          const docRef = doc(db, path);
          const unsubscribe = onSnapshot(docRef,
            (doc) => {
              if (doc.exists()) {
                resolve({ id: doc.id, ...doc.data() } as T);
              } else {
                resolve(null);
              }
            },
            (err) => reject(err)
          );
          return () => unsubscribe();
        });
      }
    }
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

// Hook for fetching a collection
export function useCollection<T>(path: string) {
  const { data, error, mutate } = useSWR<T[]>(
    path,
    null,
    {
      refreshInterval: 0,
      fetcher: (path: string) => {
        return new Promise((resolve, reject) => {
          const collectionRef = collection(db, path);
          const unsubscribe = onSnapshot(collectionRef,
            (querySnapshot) => {
              const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
              resolve(documents);
            },
            (err) => reject(err)
          );
          return () => unsubscribe();
        });
      }
    }
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

// Hook for fetching SimplePerp data
export function useSimplePerp(address: string) {
  const { data, error, mutate } = useSWR<SimplePerpWithDelta | null, Error>(
    `SimplePerp/${address}`,
    null,
    {
      refreshInterval: 0,
      fetcher: (path: string) => {
        return new Promise((resolve, reject) => {
          const docRef = doc(db, path);
          let previousData: SimplePerpWithDelta | null = null;
          const unsubscribe = onSnapshot(docRef,
            (doc) => {
              if (doc.exists()) {
                const currentData = { id: doc.id, ...doc.data() } as SimplePerpWithDelta;
                if (previousData && currentData.markPrice !== previousData.markPrice) {
                  const currentMarkPrice = parseFloat(currentData.markPrice) / Math.pow(10, 6);
                  const previousMarkPrice = parseFloat(previousData.markPrice) / Math.pow(10, 6);
                  currentData.previousMarkPrice = previousData.markPrice;
                  currentData.delta = currentMarkPrice - previousMarkPrice;
                  currentData.lastUpdateTime = Date.now();
                }
                previousData = currentData;
                resolve(currentData);
              } else {
                resolve(null);
              }
            },
            (err) => reject(err)
          );
          return () => unsubscribe();
        });
      }
    }
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

// Hook for fetching MarketUpdate data
export function useMarketUpdates(simplePerpAddress: string) {
  const { data, error, mutate } = useSWR<MarketUpdate[]>(
    `marketUpdates/${simplePerpAddress}`,
    null,
    {
      refreshInterval: 0,
      fetcher: () => {
        return new Promise((resolve, reject) => {
          console.log("Fetching market updates for:", simplePerpAddress);
          const q = query(
            collection(db, 'MarketUpdate'),
            where('simplePerpId', '==', simplePerpAddress),
            limit(100)
          );
          const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
              const updates = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MarketUpdate));
              console.log("Fetched market updates:", updates.length);
              // Sort the updates in descending order by mockedTimestamp
              updates.sort((a, b) => parseInt(b.mockedTimestamp) - parseInt(a.mockedTimestamp));
              resolve(updates);
            },
            (err) => {
              console.error("Error fetching market updates:", err);
              reject(err);
            }
          );
          return () => unsubscribe();
        });
      }
    }
  );

  console.log("useMarketUpdates hook data:", data);
  console.log("useMarketUpdates hook error:", error);

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}

// Hook for fetching Position data
export function usePosition(id: string) {
  return useDocument<Position>(`Position/${id}`);
}

// Hook for fetching all positions for a specific SimplePerp
export function usePositions(simplePerpAddress: string) {
  const { data, error, mutate } = useSWR<Position[]>(
    `positions/${simplePerpAddress}`,
    null,
    {
      refreshInterval: 0,
      fetcher: () => {
        return new Promise((resolve, reject) => {
          const q = query(collection(db, 'Position'), where('simplePerpId', '==', simplePerpAddress));
          const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
              const positions = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Position));
              resolve(positions);
            },
            (err) => reject(err)
          );
          return () => unsubscribe();
        });
      }
    }
  );
  return {
    data,
    isLoading: !error && !data,
    isError: error,
    mutate
  };
}
