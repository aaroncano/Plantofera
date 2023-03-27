import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, addDoc
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
initializeApp(firebaseConfig);
//init services
const db = getFirestore();
const plantas_obtenidasColRef = collection(db, 'plantas_obtenidas');
const plantas_encontradasColRef = collection(db, 'plantas_encontradas');

let plants = [];

//get collection data si se está en PlantsList.html
const listNameElement = document.getElementById("listName")
if(listNameElement){
    setPlantsListPage();
}
function setPlantsListPage(){
    const listName = sessionStorage.getItem("listName");
    setListName(listName);
    
    setAddDeleteButtons(listName);

    const colRef = getColRef(listName);
    
    collectDataForList(colRef);
}
function setListName(listName){
    listNameElement.textContent = listName;
}
function getColRef(listName){
    if(listName == 'Plantas Obtenidas'){
        return plantas_obtenidasColRef;
    }
    else{
        return plantas_encontradasColRef;
    }
}
function collectDataForList(colRef){
    getDocs(colRef)
        .then((snapshot) =>{
            snapshot.docs.forEach((doc) => {
                const data = doc.data();
                data.id = doc.id;
                plants.push(data);
            })
            addList();
        })    
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

function setAddDeleteButtons(listName){
    sessionStorage.setItem("listName", listName);
}
function addPlant(){
     const listName = sessionStorage.getItem("listName");
     let colRef;
     if(listName == 'Plantas Obtenidas'){
        colRef = plantas_obtenidasColRef;
     }else{
        colRef = plantas_encontradasColRef;
     }

    const addPlantForm = document.querySelector('.add');
    
    addPlantForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        addDoc(colRef, {
            scientific_name: addPlantForm.scientific_name.value,
            common_name: addPlantForm.common_name.value,
            plant_type: addPlantForm.plant_type.value,
            light_requirements: addPlantForm.light_requirements.value,
        })
        .then(() => {
            history.back();
        })
    })    
}
window.addPlant = addPlant;



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





