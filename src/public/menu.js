const opciones = ["Perfil", "Editar", "Cerrar Seccion"];
const btnMenu = document.querySelector("#menu");
btnMenu.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("hoal");
  // optionesAcount();
});

/*function optionesAcount() {
  const menu = document.querySelector("#opciones");
  opciones.forEach((op) => {
    const btn = document.createElement("li");
    if (op === "Perfil") {
      btn.innerHTML = `<a href="/perfil" class="dropdown-item" type="button">${op}</a>`;
    }

    if (op === "Editar") {
      btn.innerHTML = `<a href="/EditarPerfil" class="dropdown-item" type="button">${op}</a>`;
    }

    if (op === "Cerrar Seccion") {
      btn.innerHTML = `<a href="/cerrarSeccion" class="dropdown-item" type="button">${op}</a>`;
    }

    menu.append(btn);
  });
}
*/
