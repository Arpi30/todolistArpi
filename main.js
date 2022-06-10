
// variable, state
const variable = {
    form: document.querySelector('.form'),
    nameInput: document.getElementById('Name'),
    descInput: document.getElementById('Description'),
    dateInput: document.getElementById('date'),
    cardOutput: document.getElementById('cardGroup'),
    searchInput: document.querySelector('[data-search-input]'),
    storage: JSON.parse(localStorage.getItem('name')),
    //ID Creater
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    id: function () {
        // always start with a letter (for DOM friendlyness)
        var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
        do {
            // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
            var ascicode = Math.floor((Math.random() * 42) + 48);
            if (ascicode < 58 || ascicode > 64) {
                // exclude all chars between : (58) and @ (64)
                idstr += String.fromCharCode(ascicode);
            }
        } while (idstr.length < 32);
        return (idstr);
    },
    //UPDATE item!
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    completedIcon: function () {
        let completedIcon = document.querySelectorAll('#complet');                   //icon
        let completedCardColor = document.querySelectorAll('div.card-color');       //card element
        completedIcon.forEach((comp, compIndex) => {
            comp.onclick = (e) => {
                for (let i = 0; i < completedCardColor.length && variable.storage.length; i++) {
                    if (compIndex == i) {
                        variable.storage[i].switch = !variable.storage[i].switch;       // boolean toggle
                        comp.classList.toggle('completedIcon');
                        completedCardColor[i].classList.toggle('completedBg');
                        addLocalStorage(variable.storage, {}, "name");
                    }
                }
            }
        });
    },
    editPanel: function () {
        let element = document.querySelectorAll('.editPanel');
        let saveButton = document.querySelector('.saveButton');
        let editInput1 = document.querySelector('.editInput1');
        let editInput2 = document.querySelector('.editInput2');
        let editInput3 = document.querySelector('.editInput3');
        element.forEach(edit => {
            edit.onclick = (e) => {
                e.preventDefault();
                var foundEditName, foundEditDesc, foundEditDate;
                // get element id
                var id = e.target.dataset.id;
                for (var index = 0; index < variable.storage.length; index++) {
                    //if storaged element id === looped element id
                    if (variable.storage[index].id == id) {
                        foundEditName = variable.storage[index].name;
                        foundEditDesc = variable.storage[index].desc;
                        foundEditDate = variable.storage[index].date; 
                        editInput1.value = foundEditName;
                        editInput2.value = foundEditDesc;
                        editInput3.value = foundEditDate;
                        
                        //State change in UI and LocalStorage
                        saveButton.onclick = () => {
                            variable.storage[index].name = editInput1.value;
                            variable.storage[index].desc = editInput2.value;
                            variable.storage[index].date = editInput3.value;
                            
                            addLocalStorage(variable.storage, {}, "name");
                            location.reload();
                        }
                        break
                    }
                }
            }
        })
    },
    //Delete item!
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    deleteItem: function (id, storage, storKey) {
        //selected item with id
        let element = document.querySelectorAll(`${id}`);
        element.forEach(del => {
            del.onclick = (e) => {
                var foundIndex;
                // get element id
                var id = e.target.dataset.id;

                for (var index = 0; index < storage.length; index++) {
                    //if storaged element id === looped element id then wi have fodund out item
                    if (storage[index].id == id) {
                        foundIndex = index;
                        break
                    }
                }
                //State change
                //remove element from localstorage
                storage.splice(foundIndex, 1)
                localStorage.setItem(`${storKey}`, JSON.stringify(storage));
                render();
            }
        })
    },
}

//CREATE item!
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
function localStorageObjectSubmitEvent() {
    //Event started
    this.addEventListener('submit', (e) => {
        //we stoped before page reload
        e.preventDefault()
        //get input values
        let ipnutValue = e.target.elements.name.value;
        let descValue = e.target.elements.desc.value;
        let dateValue = e.target.elements.date.value
        //creat localstorage state
        var localStorageObject = {
            name: ipnutValue,
            desc: descValue,
            date: dateValue,
            id: variable.id(),
            switch: false,
        }
        
        //check input length
        if (ipnutValue.length >= 3 && descValue.length >= 3) {
            //check localstorage
            if (variable.storage == null) {
                variable.storage = [];
            }
            //state change
            addLocalStorage(variable.storage, localStorageObject, "name");
            render();
            
            variable.nameInput.value = '';
            variable.descInput.value = '';
            variable.dateInput.value = '';
        }
        return localStorageObject
    })
};
var formSubmit = localStorageObjectSubmitEvent();


//CREATE localstorage
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
var addLocalStorage = (obj, inputValue, storagedKey) => {
    //check if localstorage exists
    if (Object.keys(inputValue).length > 0) {
        //if not then push in existing object
        obj.push(inputValue);
    }
    //state change
    localStorage.setItem(`${storagedKey}`, JSON.stringify(obj));
    return obj
}
//READ item!
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
function render() {
    let html = '';
    //loop all the storage
    variable.storage.forEach(element => {
        html += `   <div class="card searchCard text-dark card-color ${element.switch ? "completedBg" : ""}" style="min-width: 100%" id="cardTemplate">
                        <div class="card-header d-flex flex-row justify-content-between py-2 px-2">
                            <h5 class="nameTitle m-0" id="editedName">${element.name}</h5>
                            <div class="button-group d-flex flex-row align-items-sart">
                                <form>
                                    <i class="fas fa-check-circle ${element.switch ? "completedIcon": ""}" id="complet" data-id="${element.id}"></i>
                                    <i class="fa-solid fa-pen-to-square mx-2 fa-1x editPanel" data-bs-toggle="modal" data-bs-target="#exampleModal" data-id="${element.id}"></i>
                                    <i class="fa-solid fa-trash-can" id="delete" data-id="${element.id}"></i>

                                </form>

                                <!-- Modal -->
                                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div class="modal-dialog">
                                        <div class="modal-content">
                                            <form id="editForm">
                                                <div class="modal-header">
                                                    <h5 class="modal-title" id="exampleModalLabel">Change TODO</h5>
                                                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                </div>
                                                <div class="modal-body">
                                                    <input type="text" class="mb-1 editInput1" style="width: 100%" value=" ">
                                                    <input class="editInput2" style="width: 100%" value=" "></input>
                                                    <input type=date class="editInput3 mt-1" style="width: 100%" value=" "></input>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-modal2" data-bs-dismiss="modal">Close</button>
                                                    <button type="button" class="btn btn-modal1 saveButton">Save changes</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="card-body body-color d-flex flex-row justify-content-between py-2 px-2 text-center">
                            <p class="card-text">${element.desc}</p>
                            <h5 class="card-title">${element.date}</h5>
                        </div>
                    </div>`
    });
    
    //state change
    variable.cardOutput.innerHTML = html
    //CALL FUNCTION
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/
    /*--------------------------------------------------------------------------------------*/

    variable.deleteItem('#delete', variable.storage, 'name')
    variable.completedIcon()
    variable.editPanel()
}
//keep data after reload
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
/*--------------------------------------------------------------------------------------*/
variable.storage;
render()

