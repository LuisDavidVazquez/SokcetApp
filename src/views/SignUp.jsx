'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import Axios from 'axios';
import '/public/styles/Sign.css'
import Swal from 'sweetalert2';

function Login() {

  const [error, setError] = useState("");
  
  const router = useRouter();
  const [cargando, setCargando] = useState(false);

  const crearUsuario = async (e) => {
    e.preventDefault();
    setError("");
  
    const formData = new FormData(e.currentTarget);

    if (formData.get("contraseñaConfirmar") === formData.get("contraseña")) {
      setCargando(true);
      try {
        const res = await Axios.post("/api/auth/signUp", {
          name: formData.get("usuario"),
          email: formData.get("email"),
          password: formData.get("contraseña"),
          online: false,
          redirect: false,
        });
        if(res.data.error){
          setCargando(false); 
          setError(res.data.error);
         
        }else{
          console.log(res.data)
          Swal.fire({
            icon: "success",
            title: "Creado",
            text: "Se creo correctamente tu usuario",
            showConfirmButton: false,
            timer: 2000
          })
          return router.push("/")
        }
      } catch (error) {
        setCargando(false);
        setError("Error al procesar la solicitud. Por favor, intenta de nuevo.")
        console.log(error);
      }
    }else{
      setError("Las contraseñas no coinciden");
    }

  };

  return (
    <main className='main-sign'>
      <section className='section-sign'>
        <h1 className='h1-sign'>Registrar Usuario</h1><br /><br />
        <form onSubmit={crearUsuario} className='form-sign' action="">
          <h3>Usuario</h3>
          <label className='label-sign' htmlFor="usuario">
            <input
              id="usuario"
              name="usuario"
              type="text"
              placeholder="Usuario"
              className='input-sign'
            />
          </label> <br />
          <h3>Correo</h3>
          <label className='label-sign' htmlFor="usuario">
            <input
              id="usuario"
              name="email"
              type="text"
              placeholder="Correo"
              className='input-sign'
            />
          </label> <br />
          <label className='label-sign' htmlFor="contraseña">
            <h3>Contraseña</h3>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                placeholder="Contraseña"
                className='input-sign'
              /> <br />
          </label><br />
          <label className='label-sign' htmlFor="contraseña">
            <h3>Confirmar contraseña</h3>
              <input
                id="contraseña"
                name="contraseñaConfirmar"
                type="password"
                placeholder="Contraseña"
                className='input-sign'
              />
          </label><br /><br />
          <button className='button-sign'>Registrar</button><br />
          {cargando && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                paddingBottom: "15px",
              }}
            >
              <div className="cargando"></div>
            </div>
          )}
          {error && <div style={{ display: 'flex', justifyContent: 'center' }}>{error}</div>}
        </form>
      </section>
    </main>
  )
}

export default Login