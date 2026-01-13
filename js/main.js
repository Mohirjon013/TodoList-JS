let elTodoList = document.querySelector(".todo-list")
let elInput = document.querySelector(".todo-input")
let elForm = document.querySelector(".todo-form")

let elWrapperModal = document.querySelector(".wrapper-modal")
let elInnerModal = document.querySelector(".inner-modal")
let elModalContent = document.querySelector(".modal-content")

let elCancelBtn = document.querySelector(".cancel-btn")

let elAllCount = document.querySelector(".all-count")
let elUnCompletedCount = document.querySelector(".unCompleted-count")
let elIsCompletedCount = document.querySelector(".isCompleted-count")

let elChoosenImg = document.querySelector(".choosen-img")
let elUploadedImg = document.querySelector(".uploaded-img")


let todo = JSON.parse(localStorage.getItem("setTodo")) || []


elForm.addEventListener("submit", function(e){
    e.preventDefault() // refreshi oldni oladi
    
    if(elInput.value.trim() === "") {
        alert("Please enter a todo item!")
        return
    }
    const data = {
        id:Date.now(),
        value:elInput.value,
        isCompleted:false,
        UnCompleted:true ,
        imgURL: e.target.choosenImg.files[0] ? URL.createObjectURL(e.target.choosenImg.files[0]) : null
    }
    e.target.reset()
    todo.push(data)
    renderTodo(todo)
    elUploadedImg.src = "./images/uploaded-img.jpg"
    localStorage.setItem("setTodo", JSON.stringify(todo))
})


// Rendering start 
function renderTodo(arr){
    elTodoList.innerHTML = null
    arr.forEach((item, index) => {
        let elTodoItem = document.createElement("li")
        elTodoItem.className = `flex items-center gap-5 justify-between p-[13px] border border-[#D9D9D9] ${item.isCompleted ? "opacity-50" : ""} `
        elTodoItem.innerHTML = `
            <div class="flex items-start gap-2 flex-1 ">
                <span class="block font-black text-[14px] mt-[3px] flex-shrink-0">${index + 1}.</span>
                <p class="text-[16px] block ${item.isCompleted ? "line-through" : ""} break-all flex-1">${item.value}</p>
                ${item.imgURL ? `<div class=" flex-shrink-0 w-[70px] h-[50px] rounded overflow-hidden border border-gray-200"> <img class="w-full h-full object-cover " src="${item.imgURL}" alt="uploaded-img"> </div>` : ""}
            </div>

            <div class="max-w-[190px] flex items-center gap-[10px]">
                <button id="${item.id}" type="button" class="delete-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/delete-icon.svg" alt="delete-icon" width="20" height="20">
                </button>
                <button id="${item.id}" class="update-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/update-icon.svg" alt="update-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})"class="hover:scale-125 duration-300 cursor-pointer ${item.isCompleted ? "hidden" : "block"}">
                    <img src="./images/complete-icon.svg" alt="complete-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})" class="w-[20px] h-[20px] bg-[#05FF00] rounded-full hover:scale-125 duration-300 cursor-pointer ${item.isCompleted ? "block" : "hidden"}"></button>
            </div>
        `
        elTodoList.appendChild(elTodoItem)
    });
    
    elAllCount.textContent = todo.length
    elUnCompletedCount.textContent = todo.filter(item => item.UnCompleted == true).length
    elIsCompletedCount.textContent = todo.filter(item => item.isCompleted == true).length
}
renderTodo(todo)
// Rendering start 

// delete function start
elTodoList.addEventListener("click", function(e){
    if(e.target.matches(".delete-btn")){
        const ItemDeleteId = e.target.id
        const findedDeleteIndex = todo.findIndex(item => item.id == ItemDeleteId)
        todo.splice(findedDeleteIndex, 1)
        renderTodo(todo)
        localStorage.setItem("setTodo", JSON.stringify(todo))
    }
    else if(e.target.matches(".update-btn")){
        elWrapperModal.classList.remove("scale-0")
        document.body.classList.add("overflow-y-hidden")
        
        const itemUpdatedId = e.target.id
        const findedUpdatedObj = todo.find(item => item.id == itemUpdatedId)
        

        elModalContent.innerHTML = `
            <form class="update-form sm:max-w-[600px] max-w-[350px] sm:px-[30px] px-[20px]">
                <label>
                    <input class="w-full sm:py-[11px] py-[5px] sm:px-[15px] px-[10px] rounded-lg border-[2px] border-[#32A3FE] outline-none placeholder:text-[#32A3FE]" type="text" value="${findedUpdatedObj.value}" name="user_updated" placeholder="Update your note..." autocomplete="off">
                </label>
                <label for="update-file-input" class="block sm:mt-6 mt-4 cursor-pointer block">
                    <input id="update-file-input" class="hidden update-files " type="file">
                    <img class="update-img rounded-md sm:mt-6 mt-4 mx-auto cursor-pointer object-cover" src="${findedUpdatedObj.imgURL ? findedUpdatedObj.imgURL : './images/uploaded-img.jpg'}" alt="updated-img" width="100" height="100">
                </label>
                <div class="flex items-center justify-between sm:mt-[70px] mt-[50px]">
                    <button onclick="handleCancelBtn()" class="sm:w-[100px] w-[80px] sm:py-[10px] py-[7px] rounded-lg hover:bg-[#32A3FE] hover:text-white duration-500 border-[2px] border-[#32A3FE] text-[#32A3FE] cursor-pointer" type="button">Cancel</button>
                    <button class="sm:w-[100px] w-[80px] sm:py-[10px] py-[7px] rounded-lg hover:bg-transparent hover:text-[#32A3FE] duration-500 bg-[#32A3FE] border-[2px] border-[#32A3FE] text-white cursor-pointer" type="submit">Apply</button>
                </div>
            </form>        
        `
        let elUpdateForm = document.querySelector(".update-form")
        let elUpdateImg = document.querySelector(".update-img")
        let elUpdateFiles = document.querySelector(".update-files")
        
        elUpdateFiles.addEventListener("change", function(e){
            if(e.target.files[0]){
                elUpdateImg.src = URL.createObjectURL(e.target.files[0])
            }
        })
        
        elUpdateForm.addEventListener("submit", function(e){
            e.preventDefault()
            
            findedUpdatedObj.value = e.target.user_updated.value
            findedUpdatedObj.imgURL = elUpdateImg.src
            elWrapperModal.classList.add("scale-0")
            document.body.classList.remove("overflow-y-hidden")
            renderTodo(todo)
            localStorage.setItem("setTodo", JSON.stringify(todo))
        })
    }
})
// delete function end



// Updated open and close start 
elWrapperModal.addEventListener("click", function(e){
    if(e.target.id == "wrapper"){
        elWrapperModal.classList.add("scale-0")
        document.body.classList.remove("overflow-y-hidden")
    }
})
function handleCancelBtn(){
    elWrapperModal.classList.add("scale-0")
    document.body.classList.remove("overflow-y-hidden")
}
// Updated open and close end 

// isCompleted start 
function handleCompleteBtn(id){
    const findedCompleteObj = todo.find(item => item.id == id)
    findedCompleteObj.isCompleted = !findedCompleteObj.isCompleted
    findedCompleteObj.UnCompleted = !findedCompleteObj.isCompleted    
    renderTodo(todo)
    localStorage.setItem("setTodo", JSON.stringify(todo))  
}

function handleAllbox(){
    renderTodo(todo)   
}
function handleUnCompletedBox(){
    const filteredUncompletedArr = todo.filter(item => item.UnCompleted == true)
    renderTodo(filteredUncompletedArr)
}
function handleIsCompletedBox(){
    const elIsCompletedCount = todo.filter(item => item.isCompleted == true)
    renderTodo(elIsCompletedCount)
}
// isCompleted start 


elChoosenImg.addEventListener("change", function(e){
    let changeURL = URL.createObjectURL(e.target.files[0])
    elUploadedImg.src = changeURL
})