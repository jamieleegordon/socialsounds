import { addDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase"

export const defaultFavAlbums = async (username) => {
    const favAlbumsCollectionRef = collection(db, "favouriteAlbums")

    try {
        await addDoc(favAlbumsCollectionRef, {
            username,
            albums: []
        })
    } catch (err) {
        console.error(err)
    }
}

export const checkAlreadyHasFavAlbums = async (username) => {
    const favAlbumsCollectionRef = collection(db, "favouriteAlbums");

    try {
        const q = query(favAlbumsCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        // Check if any document exists for the given username
        if (!querySnapshot.empty) {
            // If a document exists, check if the albums array is empty
            const userDoc = querySnapshot.docs[0].data(); // Get the first document
            if (userDoc.albums && userDoc.albums.length === 0) {
                return false; // Return false if the albums array is empty
            }
        }
        return true; // Return true if no document exists or albums are not empty
    } catch (err) {
        console.error("Error checking favorite albums:", err);
        return false; 
    }
}

export const addFavAlbums = async (username, albumNames) => {
    const favAlbumsCollectionRef = collection(db, "favouriteAlbums");

    try {
        const q = query(favAlbumsCollectionRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.error(`No document found for username: ${username}`);
            return;
        }

        const userDoc = querySnapshot.docs[0]; 
        const userDocRef = userDoc.ref;

        const currentAlbums = userDoc.data().albums || [];

        const updatedAlbums = [...currentAlbums, ...albumNames];

        await updateDoc(userDocRef, {
            albums: updatedAlbums
        });

        console.log(`Successfully updated albums for ${username}`);

    } catch (err) {
        console.error("Error updating albums:", err);
    }
};


