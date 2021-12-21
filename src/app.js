const SUPABASE_URL = "https://plkjtdwhwxsklfxblqad.supabase.co/rest/v1/VanillaApp";
const SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MDA4NDQ3OCwiZXhwIjoxOTU1NjYwNDc4fQ.EpAcIjyyxGlxQBERz0kL3sqqCE1SgMrwSyXmsP8LccU";
import { applyRouting } from "./routing.js";
// Lorsque les éléments du DOM sont tous connus
document.addEventListener("DOMContentLoaded", () => {
 
  // Appel HTTP vers Supabase
  fetch(`${SUPABASE_URL}?order=created_at`, {
    headers: {
      apiKey: SUPABASE_API_KEY,
    },
  })
    .then((response) => response.json())
    .then((items) => {
      items.forEach((item) => addTodo(item));
    });
    applyRouting(window.location.pathname);

    loadTodoItemsFromApi().then((items) => {
        items.forEach((item) => addTodo(item));
    });
   
});

//tu es top top top top top top top top
  const addTodo =(item) => {
      const container= document.querySelector("ul");
      container.insertAdjacentHTML("beforeend",
      `
        <li>
            <label>
                <input type="checkbox" id="todo-${item.id}" ${item.done ? "checked" : ""} /> 
                ${item.text}
            </label>
        </li>
    `
      );
      // src/app.js à la fin de la fonction addTodo()
  document
  // Nous sélectionnons la checkbox fraichement ajoutée au DOM
  .querySelector("input#todo-" + item.id)
  // Et nous lions la fonction onClickCheckbox au click 
  .addEventListener("click", onClickCheckbox);
  };
  



document.querySelector("form").addEventListener("submit", (event) => {
    // On souhaite aussi empêcher le rechargement de la page
    event.preventDefault();
  
    // On récupère l'input
    const input = document.querySelector('input[name="todo-text"]');
  
    // On créé une nouvelle tâche avec pour text la valeur tapée dans l'input
    const item = {
      text: input.value,
      done: false,
    };
    
    fetch(SUPABASE_URL, {
                method: "POST",
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json",
                    apiKey: SUPABASE_API_KEY,
                    Prefer: "return=representation",
                },
            })
            .then((response) => response.json())
            .then((items) => {
              addTodo(items[0]);
              input.value = "";
              input.focus();
            });
  
   
  });

  const onClickCheckbox = (e) => {
    // Nous récupérons l'identifiant de la checkbox (ressemble à "todo-1" ou "todo-23" ...)
  const inputId = e.target.id; 
  // Nous en déduisons l'identifiant de la tâche dans Supabase (ne récupérant que le nombre)
  const id = +inputId.split("-").pop();  
  // On découvre si la checkbox était déjà cochée ou pas
  const isDone = e.target.checked;

  // Nous empêchons le comportement par défaut de l'événement (cocher ou décocher)
  e.preventDefault();

  fetch(`${SUPABASE_URL}?id=eq.${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apiKey: SUPABASE_API_KEY,
      Prefer: "return=representation",
    },
    body: JSON.stringify({ done: isDone }),
  }).then(() => {
      // Lorsque le serveur a pris en compte la demande et nous a répond
      // Nous cochons (ou décochons) la case
    e.target.checked = isDone;
  });
};
