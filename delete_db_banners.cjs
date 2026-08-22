const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

const firebaseConfig = require('./firebase-applet-config.json');
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function main() {
  const colRef = collection(db, 'banners');
  const snapshot = await getDocs(colRef);
  for (const d of snapshot.docs) {
    console.log(`Deleting banner: ${d.id}`);
    await deleteDoc(doc(db, 'banners', d.id));
  }
  console.log('All banners deleted from Firebase.');
  process.exit(0);
}

main().catch(console.error);
