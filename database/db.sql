CREATE DATABASE repo_password;

use repo_password;

create Table
    cuenta(
        id int (6) UNSIGNED auto_increment PRIMARY KEY,
        acount VARCHAR(50) not NULL,
        email VARCHAR (100) NOT NULL,
        password VARCHAR (255),
        id_fk int(6) UNSIGNED,
        Foreign Key (id_fk) REFERENCES usuario(id_user)
    );

CREATE Table
    usuario (
        name VARCHAR(30) not NULL,
        email VARCHAR (100) not NULL,
        password VARCHAR (255) NOT NULL,
        id_user int (6) UNSIGNED auto_increment PRIMARY KEY,

)