import { initializeApp } from 'firebase/app'
import { getFirestroe, colection, getDocs
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyD-rOOA5EI9SX0Nx_JZHBA66aEY4UEPk3Q",
    authDomain: "plantofera.firebaseapp.com",
    projectId: "plantofera",
    storageBucket: "plantofera.appspot.com",
    messagingSenderId: "599097042687",
    appId: "1:599097042687:web:f6ddddf47274afc20f8eca",
    measurementId: "G-4W0K0KBH9D"
};

//init firebase app
const app = initializeApp(firebaseConfig);

//init services
const db = getFirestore();

//collection ref
const colRef = collection(db, 'plants');

//get collection data
getDocs(colRef)
    .then((snapshot) =>{
        let plants = [];
        snapshot.docs.forEach((doc) => {
            plants.push({ ...doc.data(), id: doc.id })
        })
        console.log(plants);
    })