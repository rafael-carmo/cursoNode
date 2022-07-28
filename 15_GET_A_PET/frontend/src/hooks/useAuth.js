import api from '../utils/api'

//hooks
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useFlashMessage from './useFlashMessage'


export default function useAuth() {

    const [authenticated, setAuthenticated] = useState(false);
    const { setFlashMessage } = useFlashMessage()
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')

        if (token) {
            /**sempre que enviar uma requisição com a api, estará enviando com o token,
             * sem precisar fazer isso em cada request
             */
            api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`
            setAuthenticated(true)
        }
    }, []);

    async function register(user) {

        let msgText = 'Cadastro realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/register', user).then((response) => {
                return response.data
            })
            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)

    }

    async function authUser(data) {
        setAuthenticated(true)
        localStorage.setItem('token', JSON.stringify(data.token))

        navigate('/')
    }

    const login = async (user) => {
        let msgText = 'Login realizado com sucesso!'
        let msgType = 'success'

        try {
            const data = await api.post('/users/login', user).then((response) => {
                return response.data
            })

            await authUser(data)
        } catch (error) {
            msgText = error.response.data.message
            msgType = 'error'
        }

        setFlashMessage(msgText, msgType)
    }

    const logout = () => {
        const msgText = 'Logout realizado com sucesso!'
        const msgType = 'success'

        setAuthenticated(false)
        localStorage.removeItem('token')
        api.defaults.headers.Authorization = undefined
        navigate('/login')

        setFlashMessage(msgText, msgType)
    }


    return { authenticated, register, login, logout }
}