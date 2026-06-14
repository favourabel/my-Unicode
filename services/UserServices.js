import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Get user data
export const getUserData = async (uid) => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

// Update user profile
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, data);
};

// Add a travel destination to user's list
export const addTravelDestination = async (uid, destination) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    destinations: arrayUnion(destination),
  });
};

// Get all users (for admin or social features)
export const getAllUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  return usersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};