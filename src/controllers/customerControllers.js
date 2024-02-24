const controller = {};
const path = require("path");
const bcrypt = require("bcrypt");

const LIMIT = 4;
let HOME = "/";

const user = "usuario";
let cuenta = "cuenta";

controller.list = (req, res) => {
  // eviando mensaje al navegador del cliente.
  if (req.session.loged) {
    req.getConnection((err, conn) => {
      if (err) {
        res.render("notFound", { error: err });
        return;
      }
      const cursores = [];
      let cursor = Number(req.query.cursor) || 0;
      cursores.push(cursor);

      conn.query(
        `SELECT COUNT(*) AS total FROM ${req.session.usuarioName}`,
        (err, customeTotal) => {
          if (err) {
            res.render("notFound", { error: "No resultado" });
            return;
          }
          conn.query(
            `SELECT * FROM ${req.session.usuarioName} WHERE id > ? LIMIT ? `,
            [cursor, LIMIT],
            (err, customer) => {
              if (err) {
                res.render("notFound", { error: err });
                return;
              }

              const nextCursor =
                customer.length > 0 ? customer[customer.length - 1].id : cursor;
              console.log("se registro correctamente");

              res.render("customer", {
                data: customer,
                cursor: nextCursor,
                page: Math.ceil(customeTotal[0].total / LIMIT),
                cursores: cursores,
                usuarioLoged: [req.session.usuarioName],
                opciones: ["Perfil", "Editar", "Cerrerar Secccion"],
              });
            }
          );
        }
      );
    });
  }
};

controller.add = (req, res) => {
  if (req.session.loged) {
    let data = req.body; // datos del formulario
    data.id_fk = req.session.usuarioId;
    console.log("datos agregadoqq: ", data);
    req.getConnection((err, conn) => {
      if (err) {
        res.render("notFound", { error: err });
      } else {
        console.log("cuenta", req.session.usuarioName);
        conn.query(
          `INSERT INTO ${req.session.usuarioName} SET ?`,
          data,
          (err, custome) => {
            if (err) {
              res.render("notFound", { error: err });
            } else {
              console.log("datos agregado: ", data);
              res.redirect(HOME);
            }
          }
        );
      }
    });
  }
};

controller.delete = (req, res) => {
  if (req.session.loged) {
    const { id } = req.params;

    req.getConnection((err, conn) => {
      if (err) {
        res.json(err);
      }
      conn.query(
        `DELETE  FROM ${req.session.usuarioName} WHERE id = ?`,
        [id],
        (err, custome) => {
          if (err) {
            console.log("no se pudo eliminar");
          }
          res.redirect(HOME);
        }
      );
    });
  }
};

controller.edit = (req, res) => {
  if (req.session.loged) {
    const { id } = req.params;
    // console.log(req.params);
    req.getConnection((err, conn) => {
      if (err) {
        console.error("error de conexion a la base de datos...");
        res.json(err);
      }
      conn.query(
        `SELECT * FROM ${req.session.usuarioName}  WHERE id = ?`,
        [id],
        (err, custome) => {
          if (err) {
            console.error("no se pudo insertar datos...");
            res.json(err);
          }

          res.render("editCustomer", {
            data: custome,
            usuarioLoged: req.session.usuarioName,
            opciones: ["Perfil", "Editar", "Cerrerar Secccion"],
          });
        }
      );
    });
  }
};

controller.update = (req, res) => {
  if (req.session.loged) {
    const newData = req.body;
    const { id } = req.params;

    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error al actualizar: ", err);
      }
      conn.query(
        `UPDATE ${req.session.usuarioName} SET ? WHERE id = ?`,
        [newData, id],
        (err, custome) => {
          if (err) {
            console.error("Error al actualizarrr.", err);
          }
          console.log(custome);
          res.redirect(HOME);
        }
      );
    });
  }
};

controller.perfil = (req, res) => {
  if (req.session.loged) {
    // si esta logeado puede mostrar perfil

    req.getConnection((err, conn) => {
      if (!err) {
        conn.query(
          `SELECT COUNT(*) AS total FROM ${req.session.usuarioName}`,
          (err, totalCuentas) => {
            if (!err) {
              console.log("Cuentas: ", totalCuentas);
              res.render("perfil", {
                usuarioLoged: [
                  req.session.usuarioName,
                  req.session.email,
                  req.session.password,
                  totalCuentas[0].total,
                ],
                opciones: ["Perfil", "Editar", "Cerrerar Secccion"],
              });
            }
          }
        );
      }
    });
  }
};

//editar perfil

controller.editPerfil = (req, res) => {
  if (req.session.loged) {
    res.render("EditarPerfil", {
      usuarioLoged: [
        req.session.usuarioName,
        req.session.email,
        req.session.password,
        req.session.usuarioId,
      ],
      opciones: ["Perfil", "Editar", "Cerrerar Secccion"],
    });
  }
};

//actualizar usuario
controller.updateUser = (req, res) => {
  if (req.session.loged) {
    const newData = req.body;

    const { id } = req.params;
    console.log(" paassword Actual: ", req.session.password);
    console.log(" Este es: ", newData);

    bcrypt.compare(newData.password, req.session.password, async (error, r) => {
      if (error) {
        console.log("Error Al comparar las pasword de secion: ", error);
        res.redirect("../public");
      } else {
        console.log("matchPasword: ", r);
        if (!r) {
          newData.password = await bcrypt.hash(newData.password, 10);
          console.log("Password Update: ", newData.password);
        } else {
          console.log("Password current: ", newData.password);
        }
      }
    });

    req.getConnection((err, conn) => {
      if (err) {
        console.error("Error al actualizar: ", err);
      }
      conn.query(
        `UPDATE ${user} SET ? WHERE id_user = ?`,
        [newData, id],
        (err, custome) => {
          if (err) {
            console.error("Error al actualizarrr.", err);
            return;
          }

          conn.query(
            `ALTER TABLE ${req.session.usuarioName} RENAME  TO ${newData.name}`,
            (err, result) => {
              if (!err) {
                res.redirect("../public");
              } else {
                res.render("notFound", {
                  error: "No se pudo Actualizar el Usuario",
                });
              }
            }
          );
        }
      );
    });
  }
};

controller.registrar = (req, res) => {
  try {
    res.render("registrar", { mensaje: null });
  } catch (error) {
    console.error("Error:", error);
    res.render("notFound", { error });
  }
};

controller.addUsuario =  (req, res) => {
  const data = req.body; // datos del formulario

   req.getConnection((err, conn) => {
    //VERIFICO SI EXISTE EL USUARIO
    conn.query(
      `SELECT * FROM ${user} WHERE email = ?`,
      [data.email],
      async (err, result) => {
        console.log("rows: ", result);
        if (result === null) {
          console.log("usuario ya existe!!");
          res.render("registrar", { mensaje: "Ya existe", type: "warning" });
        } else {
          data.password = await bcrypt.hash(data.password, 10);
          cuenta = cuenta + data.name;
          conn.query(`INSERT INTO ${user} SET ? `, data);

          // Crear tabla cuenta si no existe
          conn.query(`
              CREATE TABLE IF NOT EXISTS ${cuenta}(
                id int (6) UNSIGNED auto_increment PRIMARY KEY,
                acount VARCHAR(50) not NULL,
                email VARCHAR (100) NOT NULL,
                password VARCHAR (255),
                id_fk int(6) UNSIGNED,
                FOREIGN KEY (id_fk) REFERENCES ${user}(id_user)
              ) ;
            `);
          console.log("registro correcto...");
          await res.render("registrar", {
            mensaje: "Se Registro correctamente.",
            type: "success",
          });
        }
      }
    );
    // Insertar usuario
  });
  cuenta = "";
};

controller.pageInicioSeccion = (req, res) => {
   res.render("login", { msm: null });
};

//autenticando al usuario
controller.login =  (req, res) => {
  //datos del formulario
  const { email, password } = req.body;

 req.getConnection((err, conn) => {
    if (!err) {
      conn.query(
        `SELECT * FROM ${user} WHERE email = ?`,
        email,
        async (err, users) => {
          if (!err) {
            if (
              users.length != 0 &&
              (await bcrypt.compare(password, users[0].password)) &&
              users[0].email == email
            ) {
              const usuario = users[0];
              req.session.loged = true;
              req.session.usuarioId = usuario.id_user;
              req.session.usuarioName = usuario.name;
              req.session.email = usuario.email;
              req.session.password = usuario.password;
              // req.session.cookie.path = "perfil";
              console.log("Soy una seccion: ", req.session);
              console.log(user[0]);

              res.redirect(req.session.cookie.path);
            } else {
              console.log("El usuario no pudo iniciar seccion: ", users[0]);
                res.render("login", {
                msm: "Email o/ contraseña incorrecta",
                type: "warning",
              });
            }
          }
        }
      );
    }
  });
};

//cerrando la seccion del usuario
controller.logout = (req, res) => {
  if (req.session.loged) {
    req.session.destroy((error) => {
      if (error) {
        console.error("Error al cerrar sesión:", error);
        res.status(500).send("Error interno del servidor");
      } else {
        console.log("Seccion cerrada!!");
        res.redirect("../public");
      }
    });
  } else {
    res.redirect("../public");
  }
};

module.exports = controller;
