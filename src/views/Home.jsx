"use client"
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import Image from 'next/image';
import '/public/styles/Home.css'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from '@mui/material';


function Inicio() {

  const session = useSession();
  const [followers, setFollowers] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (session.data) {
      console.log(session.data)
      cargarUsuarios()
      cambiarEstatus();
      cargarSeguidores();
    }
  }, [session]);

  const cargarSeguidores = async () => {
    try {
      const res = await Axios.get(`/api/auth/followers/${session.data?.user._id}`);
      setFollowers(res.data);
    } catch (error) {
      console.log(error);
    }

    //shortpolling
    // setTimeout(async () => {
    //   try {
    //     await cargarSeguidores();
    //   } catch (error) {
    //     console.error(error);
    //   }
    // }, 20000);

  }

  const cargarUsuarios = async () => {
    try {
      const res = await Axios.get("/api/auth/users");
      setUsers(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  const cargarPublicaciones = async () => {
    try {
      const res = await Axios.get(`/api/auth/post/${session.data?.user._id}`);
      setPosts(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  const cambiarEstatus = async () => {
    try {
      const res = await Axios.put("/api/auth/signUp", {
        id: session.data?.user._id,
        online: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cerrarSesion = async () => {
    try {
      const res = await Axios.put("/api/auth/signUp", {
        id: session.data?.user._id,
        online: false,
      });
      signOut();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className='main-home'>
      <aside className='aside-home'>
        <div className='perfil-home'>
          <Image alt='perfil' src={"/images/usuario.png"} width={150} height={150}></Image>
          <br />
          <span style={{ fontSize: '20px', color: 'rgb(98, 219, 114)' }}>Online</span>
          <br />
          <h1 className='h1-home'>{session.data?.user.name}</h1><br />
          <h2>{session.data?.user.email}</h2>
        </div><br />
        <div className='titulo-amigos-home'>
          <h1 className='h1-home'>Seguidores</h1>
        </div>
        <div className='amigos-home'>
          <ul>
            {followers.map((follower) => (
              <li className='li-amigos-home' key={follower._id}>
                <div style={{ boxSizing: 'border-box', paddingRight: '10px' }}>
                  <Image alt='perfil' src={"/images/usuario.png"} width={40} height={40}></Image>
                </div>
                <div style={{ flexDirection: 'column' }}>
                  <strong className='strong-amigos-home'>{follower.name}</strong>
                  {follower.online ? <span style={{ fontSize: '16px', color: 'rgb(98, 219, 114)' }}>Online</span> : <span style={{ fontSize: '16px', color: 'rgb(255, 71, 71)' }}>Offline</span>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className='button-home'>
          <button onClick={cerrarSesion} className="button-sign">Cerrar Sesión</button>
        </div>
      </aside>
      <div style={{ flexDirection: 'column' }}>
        <header className='header-home'>

          <div className='header-search-home'>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={users}
              getOptionLabel={(option) => option.name}
              sx={{
                width: 800,
                bgcolor: 'white',
                borderRadius: 2,
                color: (theme) =>
                  theme.palette.getContrastText(theme.palette.background.paper)
              }}
              renderInput={(params) => <TextField {...params} label="Buscar usuario" />}
              ListboxProps={{
                style: { maxHeight: 150, overflow: 'auto' },
              }}
            />
          </div>

          <div className='header-createPost-home'>
            <button type='button' className='header-createPostButton-home'> Crear publicación </button>
          </div>

        </header>

        <section className='section-home'>
          <div className='section-publicaciones-home' >
            <div className='titulo-publicaciones'>
              <Image alt='perfil' src={"/images/usuario.png"} width={60} height={60}></Image>
              <div style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingLeft: '10px' }}>
                <h3>Luis David</h3>
                <span>17 / 02 / 2024</span>
                <br />
              </div>
            </div>
            <div className='contenido-publicaciones' style={{flexDirection: 'column', display: 'flex'}}>
              <h2>Hoy es el cumpleaños Angel</h2>
              <br />
            </div>
            <div className='comentarios-publicaciones'>
              <input type="text" placeholder='Escribe un comentario' /><button>Enviar</button>
            </div>
          </div >
        </section>
      </div>
    </main>
  )
}

export default Inicio;
