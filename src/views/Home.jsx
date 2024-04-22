"use client"
import { useSession } from 'next-auth/react';
import { signOut } from "next-auth/react";
import Image from 'next/image';
import '/public/styles/Home.css'
import { useEffect, useState } from 'react';
import Axios from 'axios';
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { format } from "date-fns";
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function Inicio() {

  const session = useSession();
  const [followers, setFollowers] = useState([]);
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [comentario, setComentario] = useState('');
  const [ok, setOk] = useState(true);

  function actualizarEstados() {
    cargarUsuarios()
    cargarSeguidores();
    cargarPublicaciones();
  }

  //Socket.io
  useEffect(()=>{
    socket.on('message', message => {
      console.log("mensaje:", message)
      Swal.fire({
        position: "top-end",
        title: `Notificación`,
        text: message,
        icon: 'info',
        showConfirmButton: false,
        timer: 2000
      });
    })
  },[])

  useEffect(() => {
    if (session.data) {
      if (ok) {
        cambiarEstatus();
        actualizarEstados();
        obtenerNotificaciones();
        obtenerNotificacionNueva();
        setOk(false)
      }
    }
  }, [session]);

  const cambiarEstatus = async () => {
    try {
      await Axios.put("/api/auth/signUp", {
        id: session.data?.user._id,
        online: true,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const res = await Axios.get(`/api/auth/unfollowers/${session.data?.user._id}`);
      setUsers(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  const cargarSeguidores = async () => {
    try {
      const res = await Axios.get(`/api/auth/followers/${session.data?.user._id}`);
      setFollowers(res.data);
    } catch (error) {
      console.log(error);
    }
    //short polling
    setTimeout(async () => {
      try {
        await cargarSeguidores();
      } catch (error) {
        console.error(error);
      }
    }, 3000);
  }
  /////////////////////////////////
  const cargarPublicaciones = async () => {
    try {
      const res = await Axios.get(`/api/auth/post/${session.data?.user._id}`);
      setPosts(res.data);
    } catch (error) {
      console.log(error)
    }
  }

  const crearPublicacion = async () => {
    Swal.fire({
      title: 'Escribe tu publicación',
      input: 'text',
      inputPlaceholder: 'Escribe aquí...',
      showCancelButton: true,
      confirmButtonText: 'Crear',
      confirmButtonColor: 'green',
      cancelButtonText: 'Cancelar',
      showLoaderOnConfirm: true,
      preConfirm: async (inputValue) => {
        try {
          const res = await Axios.post("/api/auth/post", {
            user_id: session.data?.user._id,
            fecha: format(new Date(), "hh:mm a dd/MM/yyyy "),
            content: inputValue
          });
          //Long polling
          await Axios.post("http://localhost:3001/notificaciones", {
            cuerpo: "Nueva publicacion",
            id_user: session.data?.user._id
          })
          /////////////////////////////////
          console.log(res.data);
        } catch (error) {
          console.log("Hubo un error: ", error)
        }
      },
    });
  }

  const dejarComentario = async (post_id) => {
    if (comentario == null) {
      Swal.fire({
        icon: "warning",
        title: "El comentario esta vacio"
      })
    } else {
      try {
        await Axios.put("/api/auth/comments", {
          user_id: session.data?.user._id,
          post_id: post_id,
          content: comentario
        })
        await Axios.post("http://localhost:3001/notificaciones", {
          cuerpo: "Nuevo comentario",
          id_user: session.data?.user._id
        })
      } catch (error) {
        console.log(error)
      } finally {
        setComentario('')
      }
    }

  }

  const seguirUsuario = async (event, value) => {
    if (value) {
      setSelectedUser(value);
      Swal.fire({
        title: '¿Quieres seguir a ' + value.name + '?',
        showCancelButton: true,
        confirmButtonText: 'Seguir',
        cancelButtonText: 'Cancelar',
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            const res = await Axios.put("/api/auth/followers", {
              id_follower: value._id,
              id: session.data?.user._id
            });
            Swal.fire({
              title: 'Ahora sigues a ' + value.name,
            });
            //socket.io
            const message = session.data?.user.name + " ahora sigue a " + value.name
            socket.emit('message', message)
            console.log(message)
            console.log(res.data);
          } catch (error) {
            console.log("Hubo un error: ", error)
          } finally {
            actualizarEstados();
            setSelectedUser(null);
          }
        },
      });
    }
  }

  const cerrarSesion = async () => {
    try {
      await Axios.put("/api/auth/signUp", {
        id: session.data?.user._id,
        online: false,
      });
      signOut();
    } catch (error) {
      console.error(error);
    }
  }

  //Long polling
  const pintarNotificacion = (notificacion) => {
    Swal.fire({
      position: "top-end",
      title: `Notificación`,
      text: notificacion.cuerpo,
      icon: 'info',
      showConfirmButton: false,
      timer: 2000
    });
    actualizarEstados()
  };

  const obtenerNotificaciones = async () => {
    try {
      const res = await fetch("http://localhost:3001/notificaciones");
      const data = await res.json();
      const notificaciones = data.notificaciones;
      notificaciones.forEach(pintarNotificacion);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerNotificacionNueva = async () => {
    try {
      const res = await fetch("http://localhost:3001/nueva-notificacion");
      const data = await res.json();
      pintarNotificacion(data.notificacion);
    } catch (error) {
      console.error(error);
    } finally {
      obtenerNotificacionNueva();
    }
  };
  ///////////////////////////////////////////

  return (
    <main className='main-home'>
      <aside className='aside-home'>
        <div className='perfil-home'>
          <Image priority={false} alt='perfil' src={"/images/usuario.png"} width={150} height={150}></Image>
          <br />
          <span style={{ fontSize: '20px', color: 'rgb(98, 219, 114)' }}>Online</span>
          <br />
          <h1 className='h1-home'>{session.data?.user.name}</h1><br />
          <h2>{session.data?.user.email}</h2>
        </div><br />
        <div className='titulo-amigos-home'>
          <h1 className='h1-home'>Seguidos</h1>
        </div>
        <div className='amigos-home'>
          <ul>
            {followers.map((follower) => (
              <li className='li-amigos-home' key={follower._id}>
                <div style={{ boxSizing: 'border-box', paddingRight: '10px' }}>
                  <Image priority={false} alt='perfil' src={"/images/usuario.png"} width={40} height={40}></Image>
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
              onChange={seguirUsuario}
              value={selectedUser}
              ListboxProps={{
                style: { maxHeight: 150, overflow: 'auto' },
              }}
            />
          </div>
          <div className='header-createPost-home'>
            <button type='button' className='header-createPostButton-home' onClick={crearPublicacion}> Crear publicación </button>
          </div>
        </header>
        <section className='section-home'>
          {posts.map((post) => (
            <div className='section-publicaciones-home' key={post._id} >
              <div className='titulo-publicaciones'>
                <Image priority={false} alt='perfil' src={"/images/usuario.png"} width={60} height={60}></Image>
                <div style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingLeft: '10px' }}>
                  <h3>{post.user_id.name}</h3>
                  <span>{post.fecha}</span>
                  <br />
                </div>
              </div>
              <div className='contenido-publicaciones' style={{ flexDirection: 'column', display: 'flex' }}>
                <h2>{post.content}</h2>
                <br />
              </div>
              <div className='comentarios-publicaciones'><br />
                {post.comments.map((comment) => (
                  <div key={comment._id} style={{ display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingLeft: '10px' }}>
                    <h4>{comment.user_id.name}</h4>
                    <span>{comment.content}</span><br />
                  </div>
                ))}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                  <input
                    type="text"
                    className='comentarios-input'
                    placeholder='Escribe un comentario'
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                  /><button className='comentarios-boton' type='button' onClick={() => dejarComentario(post._id)}>Enviar</button>
                </div>
              </div>
            </div >
          ))}
        </section>
      </div>
    </main>
  )
}

export default Inicio;
