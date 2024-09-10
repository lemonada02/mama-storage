import React from 'react'

import Form from "../components/Form"

export default function Login() {
    return(
        <div>
            <Form route="/api/token/" method="login" />
            <a href="/register">Regístrate</a>
        </div>
    ) 
}
