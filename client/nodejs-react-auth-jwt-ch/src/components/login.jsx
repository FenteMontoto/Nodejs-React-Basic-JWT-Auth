import { React, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import validateLogin from "../js/validateLogin";
import UserContext from "../context/userContext";

function Login(){

    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    let navegar = useNavigate();

    const {loginStatus, setLoginStatus, login, setLogin} = useContext(UserContext);
    const [prueba, setPrueba] = useState("");


    useEffect(()=>{
        fetch("http://localhost:4000/Login",{
            credentials: "include"
        })
        .then(response => response.json())
        .then((userdata) => {

            console.log(userdata);

            let LoginSec = document.querySelector(".loginRes");
            let h3 = document.createElement("h3");

            LoginSec.innerHTML = "";

            if (userdata == "todavia no"){
                setLoginStatus(true);
            } else if (userdata == "noToken") {
                setLoginStatus(false);
            } else if (userdata == "Expired"){
                setLoginStatus(false);
                setLogin(false);
                LoginSec.style.padding = "10px;"
                LoginSec.style.backgroundColor = "Orange";
                h3.innerText = "El token no es válido o ha caducado";
                LoginSec.append(h3);
            }

            if (login == true && loginStatus == true){
                navegar("/");
            } else if (login == false && loginStatus == true){
                navegar("/");
            } else if (login == true && loginStatus != true){
                navegar("/Login/");
            } else if (login == false && loginStatus != true){
                navegar("/Login/");
            }

        })
        .catch(errores => console.log(errores));
    }, [loginStatus]);


    const handleSubmit = (e)=>{
        e.preventDefault();
        
        let datos = {
            email : email,
            password : password
        }

        fetch("http://localhost:4000/Login", {
            method: "POST",
            body: JSON.stringify(datos),
            credentials: "include",
            headers : {
                "Content-Type": "application/json"
            }
        })
        .then(respuesta => respuesta.json())
        .then((data) => {
            if (validateLogin(data) == "valid"){
                setLogin(true);
                navegar("/");
            }
        })
        .catch(error => console.log(error))
    }

    return(
        <section className="LoginSec">
            <h3>Login</h3>
            <form onSubmit={handleSubmit}>
                <input required onChange={(e)=>{setEmail(e.target.value)}} type="email" placeholder="Introducde tu email" name="email"/>
                <br />
                <input required onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Introduce tu contraseña" name="password"/>
                <br />
                <button>Login</button>
            </form>
            <div className="loginRes">

            </div>
        </section>
    );
}


export default Login;