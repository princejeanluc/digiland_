
const apiUrl = 'http://0.0.0.0:9000';


/*---------------------------------------------------------------------------------*/








/*---------------------------------------------------------------------------------*/
async function fetchJson(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la requête :', error.message);
    throw error;
  }
}
/*---------------------------------------------------------------------------------*/
async function Talk(formData, method,route, callback) {

  // Envoyer les données via fetchJson
  try {
    // Remplacez ceci par votre URL d'API
    const options = {
      method: method,
      mode:"no-cors",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mymasterkey',
      },
      body: JSON.stringify(formData),
    };

    const response = await fetchJson(apiUrl+route, options);
    const result = await response.json();
    callback(response,result)

  } catch (error) {
    console.error('Erreur lors de l\'envoi des données :', error);
  }
}

/*---------------------------------------------------------------------------------*/
const SubmitSignup =  (event) =>{
  event.preventDefault()
  const  cin= document.getElementById('cin');
  const name = document.getElementById('name');
  const telephone = document.getElementById('telephone');
  const ville = document.getElementById('ville');
  const password = document.getElementById('password');

  const formData = {
    cin: cin.value,
    name: name.value,
    telephone: telephone.value,
    ville: ville.value,
    password: password.value,
  };

  Talk(formData,"post","/users",(resp, result)=> {
    if (resp.status == 201) {
     prompt("reussi")
    }else{
      prompt("echec")
    }

  })

  }
  const formulaire = document.getElementById('signupform');
formulaire.addEventListener('submit', SubmitSignup);
console.log("slfdsqo")

