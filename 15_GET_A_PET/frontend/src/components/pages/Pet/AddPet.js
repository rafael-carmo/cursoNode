import {useState} from 'react'
import api from '../../../utils/api'
import { useNavigate } from 'react-router-dom'
import styles from './AddPet.module.css'

//HOOKS
import useFlashMessage from '../../../hooks/useFlashMessage'

//COMPONENTS
import PetForm from '../../form/PetForm'

const AddPet = () => {
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const {setFlashMessage} = useFlashMessage()
    const navigate = useNavigate()

    const registerPet = async (pet) => {
        let msgType = 'success'

        const formData = new FormData()

        const petFormData = await Object.keys(pet).forEach((key) => {
            if(key === 'images') {
                for(let i=0; i<pet[key].length; i++){
                    formData.append('images',pet[key][i])
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        formData.append('pet', petFormData)

        const data = await api.post(
            'pets/create',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${JSON.parse(token)}`,
                    'Context-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                return response.data
            })
            .catch((error) => {
                msgType = 'error'
                return error.response.data
            })

            console.log(data.message)
            setFlashMessage(data.message, msgType)

            if(msgType !== 'error'){
                navigate('/pet/mypets')
            }
    }

    return (
        <section className={styles.addpet_header}>
            <div>
                <h1>Cadastre um Pet</h1>
                <p>Depois ele ficará disponível para adoção</p>
            </div>
            <PetForm handleSubmit={registerPet} btnText='Cadastrar'/>
        </section>
    )
}

export default AddPet
