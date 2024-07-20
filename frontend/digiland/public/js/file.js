
const apiUrl = 'http://0.0.0.0:9000/';


/*---------------------------------------------------------------------------------*/

form.addEventListener("submit" , (event)=>{
  event.preventDefault()
  const  cin= document.getElementById('cin');
  const name = document.getElementById('name');
  const telephone = document.getElementById('telephone');
  const ville = document.getElementById('ville');
  const password = document.getElementById('password');
  const formElement = new FormData(form)
  fetch(apiUrl+"users",
      {
        method:"POST",
        mode:"cors",
        body:formElement
      }
  ).then((result)=>{
    if (result.status != 200) {
      next(true, null)
    }else{
      next(result.json())
    }
  }).then((data)=>{
    prompt(data.toString())
  }).catch((err)=>{
    prompt(err.toString())
  })
})