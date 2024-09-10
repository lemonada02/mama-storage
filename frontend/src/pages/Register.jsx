import React from 'react'

import Form from "../components/Form"

export default function Register() {
  return(
    <div>
        <Form route="/api/users/register/" method="register" />
        <a href="/login">Iniciar Sesión</a>
    </div>
) }
