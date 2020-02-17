 
const itemTemplate = (item) =>{
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>
        `
}
    // page loader
    let ourHtm = items.map((item) =>{
        return itemTemplate(item)
    }).join('')
    document.getElementById('item-list').insertAdjacentHTML('beforeend', ourHtm)
 //create 
 let creatField = document.getElementById('create-field')
 document.getElementById('create-form').addEventListener('submit', (props) =>{
    props.preventDefault();
    axios.post('/create-item', { text: creatField.value}).then((respnse)=>{
        //create HTML
        creatField.value = "";
        creatField.focus();
        document.getElementById('item-list').insertAdjacentHTML('beforeend', itemTemplate(respnse.data))

    }).catch( () =>{
        alert('somthin wont wrong')
    })
 })
 
 document.addEventListener("click", (props)=>{

    // delete
    if(props.target.classList.contains('delete-me')){
        if(confirm("Do you really want this item ?")){
            axios.post('/delete-item', { id: props.target.getAttribute("data-id")}).then(()=>{
                props.target.parentElement.parentElement.remove()
            }).catch( () =>{
                alert("please ty again later")
            })

        }
    }


    //edit
     if(props.target.classList.contains('edit-me')){
         let userInput = prompt("enter New Text", props.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
        if(userInput){
            axios.post('/update-item', {text: userInput, id: props.target.getAttribute("data-id")}).then(()=>{
                props.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput;
            }).catch( () =>{
                console.log("please ty again later")
            })
        }
     }
 }) 