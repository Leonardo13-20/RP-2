const express = require("express");
const router = express.Router();
const coustomerController = require("../controllers/customerControllers");

//router.get("/", coustomerController.notFound);

router.get("/", coustomerController.list);

router.post("/add", coustomerController.add);

router.get("/delete/:id", coustomerController.delete);

router.get("/editCustomer/:id", coustomerController.edit);

router.post("/update/:id", coustomerController.update);

router.get("/perfil", coustomerController.perfil);

router.get("/registrar", coustomerController.registrar);

router.post("/addUsuario", coustomerController.addUsuario);

router.get("/inicioSeccion", coustomerController.pageInicioSeccion);

router.post("/login", coustomerController.login);

router.get("/EditarPerfil", coustomerController.editPerfil);

router.post("/updateUser/:id", coustomerController.updateUser);

router.get("/cerrarSeccion", coustomerController.logout);

module.exports = router;
