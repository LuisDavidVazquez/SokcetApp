'use client';
import { useState } from 'react';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from 'next/link';
import '/public/styles/Sign.css'
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';

function Login() {

  const [error, setError] = useState("");
  const router = useRouter();
  const [cargando, setCargando] = useState(false);
  const session= useSession();

  const handleSubmit = async () => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");
    setCargando(true);
    try {
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("contraseña"),
        redirect: false,
      });
      if (res?.error) {
        setCargando(false);
        return setError(res.error);
      }
      if (res?.ok) {
        Swal.fire({
          icon: "success",
          title: "Bienvenido",
          showConfirmButton: false,
          timer: 1000
        });
        return router.push("/home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className='main-sign'>
      <section className='section-sign'>
        <h1 className='h1-sign' >Inicio de sesión</h1><br /><br />
        <form onSubmit={handleSubmit} className="form-sign" action="">
          <h3>Correo</h3>
          <label className='label-sign' htmlFor="usuario">
            <input
              id="usuario"
              name="email"
              type="text"
              placeholder="Correo"
              className='input-sign'
            />
          </label><br />
          <label className='label-sign' htmlFor="contraseña">
            <h3>Contraseña</h3>
              <input
                id="contraseña"
                name="contraseña"
                type="password"
                placeholder="Contraseña"
                className='input-sign'
              />
          </label><br />
          <Link type='button' className='signUp' href={"/signUp"}>Registre un nuevo usuario</Link><br />
          <button className="button-sign">Ingresar</button>

          <br />
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