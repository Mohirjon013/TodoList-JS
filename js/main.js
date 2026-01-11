let elTodoList = document.querySelector(".todo-list")
let elInput = document.querySelector(".todo-input")
let elForm = document.querySelector(".todo-form")

let elWrapperModal = document.querySelector(".wrapper-modal")
let elInnerModal = document.querySelector(".inner-modal")
let elModalContent = document.querySelector(".modal-content")

let elCancelBtn = document.querySelector(".cancel-btn")

let elAllCount = document.querySelector(".all-count")
let elUnCompletedCount = document.querySelector(".unCompleted-count")
let eIIsCompletedCount = document.querySelector(".isCompleted-count")

let elChoosenImg = document.querySelector(".choosen-img")
let elUploadedImg = document.querySelector(".uploaded-img")


let todo = JSON.parse(localStorage.getItem("setTodo")) || []


elForm.addEventListener("submit", function(e){
    e.preventDefault() // refreshi oldni oladi
    const data = {
        id:todo.length + 1,
        value:elInput.value,
        isComplated:false,
        UnComplated:true ,
        imgURL: e.target.choosenImg.files[0] ? URL.createObjectURL(e.target.choosenImg.files[0]) : null
    }
    e.target.reset()
    todo.push(data)
    renderTodo(todo)
    elUploadedImg.src = "./images/uplaod-icon.svg"
    localStorage.setItem("setTodo", JSON.stringify(todo))
})



// Rendering start 
function renderTodo(arr){
    elTodoList.innerHTML = null
    arr.forEach((item, index) => {
        let elTodoItem = document.createElement("li")
        elTodoItem.className = `flex items-center gap-5 justify-between p-[13px] border border-[#D9D9D9] ${item.isComplated ? "opacity-50" : ""} `
        elTodoItem.innerHTML = `
            <p class="text-[20px] font-normal">
                <span class="font-semibold text-[14px] mr-[5px]">${index + 1}.</span>
                <span class="${item.isComplated ? "line-through" : ""}">${item.value}</span>
            </p>
            
            ${item.imgURL ? `<img src="${item.imgURL}" alt="uploaded-img" width="50" height="50">` : ""}
            <div class="flex items-center gap-[10px]">
                <button id="${item.id}" type="button" class="delete-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/delete-icon.svg" alt="delete-icon" width="20" height="20">
                </button>
                <button id="${item.id}" class="update-btn hover:scale-125 duration-300 cursor-pointer">
                    <img class="pointer-events-none" src="./images/update-icon.svg" alt="update-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})"class="hover:scale-125 duration-300 cursor-pointer ${item.isComplated ? "hidden" : "block"}">
                    <img src="./images/complete-icon.svg" alt="complete-icon" width="20" height="20">
                </button>
                <button onclick="handleCompleteBtn(${item.id})" class="w-[20px] h-[20px] bg-[#05FF00] rounded-full hover:scale-125 duration-300 cursor-pointer ${item.isComplated ? "block" : "hidden"}"></button>
            </div>
        `
        elTodoList.appendChild(elTodoItem)
    });
    
    elAllCount.textContent = todo.length
    elUnCompletedCount.textContent = todo.filter(item => item.UnComplated == true).length
    eIIsCompletedCount.textContent = todo.filter(item => item.isComplated == true).length
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
            <form class="update-form mb-[100px] max-w-[600px] px-[30px]">
                <label>
                    <input class="w-full py-[11px] px-[15px] rounded-lg border-[2px] border-[#32A3FE] outline-none placeholder:text-[#32A3FE]" type="text" value="${findedUpdatedObj.value}" name="user_updated" placeholder="Update your note..." autocomplete="off">
                </label>
                <label>
                    <input class="hidden update-files" type="file">
                    <img class="update-img rounded-md mt-6 mx-auto" src="${findedUpdatedObj.imgURL}" alt="updated-img" width="100" height="100">
                </label>
                <div class="flex items-center justify-between mt-[100px]">
                    <button onclick="handleCancelBtn()" class="w-[100px] py-[10px] rounded-lg hover:bg-[#32A3FE] hover:text-white duration-500 border-[2px] border-[#32A3FE] text-[#32A3FE] cursor-pointer" type="button">Cancel</button>
                    <button class="w-[100px] py-[10px] rounded-lg hover:bg-transparent hover:text-[#32A3FE] duration-500 bg-[#32A3FE] border-[2px] border-[#32A3FE] text-white cursor-pointer" type="submit">Apply</button>
                </div>
            </form>        
        `
        let elUpdateForm = document.querySelector(".update-form")
        let elUpdateImg = document.querySelector(".update-img")
        let elUpdateFiles = document.querySelector(".update-files")

        elUpdateFiles.addEventListener("change", function(e){
            elUpdateImg.src = URL.createObjectURL(e.target.files[0])
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

// isComplated start 
function handleCompleteBtn(id){
    const findedCompleteObj = todo.find(item => item.id == id)
    findedCompleteObj.isComplated = !findedCompleteObj.isComplated
    findedCompleteObj.UnComplated = !findedCompleteObj.isComplated    
    renderTodo(todo)
    localStorage.setItem("setTodo", JSON.stringify(todo))  
}

function handleAllbox(){
    renderTodo(todo)   
}
function handleUnCompletedBox(){
    const filteredUncompletedArr = todo.filter(item => item.UnComplated == true)
    renderTodo(filteredUncompletedArr)
    localStorage.setItem("setTodo", JSON.stringify(todo))
    
}
function handleIsCompletedBox(){
    const eIIsCompletedCount = todo.filter(item => item.isComplated == true)
    renderTodo(eIIsCompletedCount)
    localStorage.setItem("setTodo", JSON.stringify(todo)) 
}
// isComplated start 

elChoosenImg.addEventListener("change", function(e){
    changeURL = URL.createObjectURL(e.target.files[0])
    elUploadedImg.src = changeURL
})