import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc,
    query, where
} from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

import './Authentication.js'

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
initializeApp(firebaseConfig);
//init services
const db = getFirestore();
const colRef__ = collection(db, 'plantas_encontradas');

let plants = [];

//get collection data si se está en PlantsList.html
const listNameElement = document.getElementById("listName")
if(listNameElement){
    setPlantsListPage();
}
function setPlantsListPage(){
    const listName = sessionStorage.getItem("listName");
    setListName(listName);

    const plantasObtenidasValue = getPlantasObtenidasValue(listName);

    setAddDeleteButtons(plantasObtenidasValue);
    
    collectAllData(plantasObtenidasValue);
    addList();
}
function setListName(listName){
    listNameElement.textContent = listName;
}
function setAddDeleteButtons(plantasObtenidasValue){
    sessionStorage.setItem("plantasObtenidasValue", plantasObtenidasValue);
}
function getPlantasObtenidasValue(listName){
    if(listName == 'Plantas Obtenidas'){
        return '1';
    }
    else{
        return '0';
    }
}
function collectAllData(plantasObtenidasValue) {
    let promises = [collectDataOfList(plantasObtenidasValue)];
    
    Promise.all(promises).then(() => {
      addList();
    });
}
  
async function collectDataOfList(plantasObtenidasValue){
    const snapshot = await getDocs(colRef__);
    snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if(plantasObtenidasValue == '1'){
            if(data.obtained == '1'){
                data.id = doc.id;
                plants.push(data);
            }
        }else{
            data.id = doc.id;
            plants.push(data);
        }
        
    });
}
//añadir lista de plantas a html
function addList() {
    const listContainer = document.querySelector(".list-container");
    const template = document.querySelector("#listElement-template");
    const fragment = document.createDocumentFragment();

    plants.forEach((item, index) => {
        const listItem = template.content.cloneNode(true);
        listItem.querySelector(".img").dataset.id = index;
        listItem.querySelector(".img").addEventListener("click", goToDataPlantDataPage);

        const storage = getStorage();
        const imageElement = listItem.querySelector('.img');
        const imageRef = ref(storage, 'images/' + item.scientific_name);
        getDownloadURL(imageRef)
            .then((url) => {
                imageElement.src = url;
                imageElement.alt = value;
            })
            .catch((error) => {
                console.error('Error downloading image:', error);
            });

        listItem.querySelector(".section-title").textContent = item.scientific_name;
        fragment.appendChild(listItem);
    });

    listContainer.appendChild(fragment);
}

function goToDataPlantDataPage(event) {
    if (plants.length === 0) {
      console.error("El arreglo 'plants' está vacío.");
      return;
    }
  
    const clickedItemId = event.currentTarget.dataset.id;
    const clickedPlant = plants[clickedItemId];
    sessionStorage.setItem("plantData", JSON.stringify(clickedPlant));

    window.location.href = "PlantData.html";
}




//add documents ONCLICK AÑADIR PLANTA
function goToAddPlant(){
    window.location.href = "newPlant.html";
}
window.goToAddPlant = goToAddPlant;
function goToDeletePlant(){
    window.location.href = "deletePlant.html";
}
window.goToDeletePlant = goToDeletePlant;

const elementoUnicoNewPlant = document.querySelector('.add');
if(elementoUnicoNewPlant){
    addPlant();
}
function addPlant(){
    const plantasObtenidasValue = sessionStorage.getItem("plantasObtenidasValue");
    const addPlantForm = document.querySelector('.add');
    
    addPlantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const storage = getStorage();
        const imageUpload = document.getElementById('imageUpload');
        const file = imageUpload.files[0];
        const storageRef = ref(storage, 'images/' + addPlantForm.scientific_name.value);
        uploadBytes(storageRef, file);

        addDoc(colRef__, {
            scientific_name: addPlantForm.scientific_name.value,
            common_name: addPlantForm.common_name.value,
            plant_type: addPlantForm.plant_type.value,
            light_requirements: addPlantForm.light_requirements.value,
            obtained: plantasObtenidasValue
        })
        .then(() => {
            history.back();
        })
    })    
} 
window.addPlant = addPlant;

const elementoUnicoDeletePlant = document.querySelector('.delete');
if(elementoUnicoDeletePlant){
    deletePlant();
}
function deletePlant() {
    const plantasObtenidasValue = sessionStorage.getItem("plantasObtenidasValue");
    const deletePlantForm = document.querySelector(".delete");
  
    deletePlantForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log(deletePlantForm.scientific_name.value);
      const q = query(colRef__, where('scientific_name', "==", deletePlantForm.scientific_name.value));

      const querySnapshot = await getDocs(q);

      if(!querySnapshot.empty){
        const docId = querySnapshot.docs[0].id;
        const docRef = doc(db, 'plantas_encontradas', docId);
        await deleteDoc(docRef)
        .then(() => {
           history.back(); 
        });
      }else{
        console.log("no se encontró ninguna planta");
      }
    });
}

//recolectar datos en PlantData enviados por sessionStorage
const elementoUnicoPlantData = document.querySelector('.info-container');
if(elementoUnicoPlantData){
    writePlantData();
}
function writePlantData(){
    document.addEventListener("DOMContentLoaded", () => {
        const plantData = JSON.parse(sessionStorage.getItem("plantData"));
    
        if (plantData) {
            console.log(plantData);
            
            Object.keys(plantData).forEach(key => {
                const element = document.getElementById(key);  
                const value = plantData[key];
                
                if(element){
                    if(key == 'scientific_name'){
                        const titleElement = document.getElementById('plant-name');
                        titleElement.textContent = value;

                        const storage = getStorage();
                        const imageElement = document.querySelector('.info-img');
                        const imageRef = ref(storage, 'images/' + value);
                        getDownloadURL(imageRef)
                            .then((url) => {
                                imageElement.src = url;
                                imageElement.alt = value;
                            })
                            .catch((error) => {
                                console.error('Error downloading image:', error);
                            });
                    }
                    
                    const nodeValue = document.createTextNode(value);
                    element.insertBefore(nodeValue, element.querySelector('span').nextSibling);    
                }
                
            });

        } else {
        console.error("No se encontró información de la planta en sessionStorage.");
        }
    });    
}

//plantsList.html
function goToPlantsList(listName){
    sessionStorage.setItem("listName", (listName));
    window.location.href = "plantsList.html";
}
window.goToPlantsList = goToPlantsList;

function goToMenu(){
    window.location.href = "Menu.html";
}
window.goToMenu = goToMenu;