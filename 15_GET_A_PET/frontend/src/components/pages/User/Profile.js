import { useState, useEffect, useContext } from "react"
import { Context } from "../../../context/UserContext"
import Input from "../../form/Input"

import api from "../../../utils/api"

import styles from '../../pages/User/Profile.module.css'
import formStyles from '../../form/Form.module.css'

import useFlashMessage from '../../../hooks/useFlashMessage'
import RoundedImage from "../../layout/RoundedImage"

const Profile = () => {

    const [user, setUser] = useState({});
    const [preview, setPreview] = useState();
    const [token] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/users/checkuser', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            }
        }).then((response) => {
            setUser(response.data)
        })
    }, [token]);

    const onFileChange = (e) => {
        setPreview(e.target.files[0])
        setUser({ ...user, [e.target.name]: e.target.files[0] })
    }

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        let msgType = 'success'

        //precisa do formData pois tem uma imagem sendo enviada
        const formData = new FormData()

        //adiciona os campos de usuário no formData
        //Gera um objeto formData preenchido com os dados do usuário
        const userFormData = await Object.keys(user).forEach((key) => 
            formData.append(key, user[key]),
        )

        const data = await api.patch(`/users/edit/${user._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type': 'multipart/form-data' //para o express entender que esse formulário pode ir dados de imagem
            },
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            msgType = 'error'
            return error.response.data
        })
        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.profile_header}>
                <h1>Profile</h1>
                {(user.image || preview) && (
                    <RoundedImage src={
                        preview ? URL.createObjectURL(preview)
                        : `${process.env.REACT_APP_API}/images/users/${user.image}`
                    } 
                    alt={user.name} />
                )}
            </div>
            <form className={formStyles.form_container} onSubmit={handleSubmit}>
                <Input
                    text='Imagem'
                    type='file'
                    name='image'
                    handleOnChange={onFileChange}
                />
                <Input
                    text="Nome"
                    type="text"
                    name="name"
                    placeholder="Digite seu nome"
                    handleOnChange={handleChange}
                    value={user.name || ''}
                />
                <Input
                    text="E-mail"
                    type="email"
                    name="email"
                    placeholder="Digite seu email"
                    handleOnChange={handleChange}
                    value={user.email || ''}
                />
                <Input
                    text="Telefone"
                    type="text"
                    name="phone"
                    placeholder="Digite seu telefone"
                    handleOnChange={handleChange}
                    value={user.phone || ''}
                />
                <Input
                    text="Senha"
                    type="password"
                    name="password"
                    placeholder="Digite sua senha"
                    handleOnChange={handleChange}
                />
                <Input
                    text="Confirmação de senha"
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirme sua senha"
                    handleOnChange={handleChange}
                />
                <input type="submit" value="Editar" />
            </form>
        </section>
    )
}

export default Profile
