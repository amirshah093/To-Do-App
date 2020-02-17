 
 
 
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