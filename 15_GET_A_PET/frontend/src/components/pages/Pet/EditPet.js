import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom';
import useFlashMessage from '../../../hooks/useFlashMessage';
import api from '../../../utils/api';
import PetForm from '../../form/PetForm'
import styles from './AddPet.module.css'

const EditPet = () => {

    const [pet, setPet] = useState({});
    const [token] = useState(localStorage.getItem('token') || '');
    const {id} = useParams()
    const {setFlashMessage} = useFlashMessage()

    useEffect(() => {
        api.get(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        })
        .then((response) => {
            setPet(response.data.pet)

            console.log(response.data.pet)
        })
    }, [token, id]);

    const updatePet = async (pet) => {
        let msgType = 'success'

        const formData =  new FormData()

        const petFormData = await Object.keys(pet).forEach((key) => {
            if(key === 'images'){
                for (let i = 0; i < pet[key].length; i++) {
                    formData.append('images', pet[key][i]);
                }
            } else {
                formData.append(key, pet[key])
            }
        })

        formData.append('pet', petFormData)

        const data = await api.patch(`pets/${pet._id}`, formData, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
                'Content-Type':'multipart/form-data',
            },
        })
        .then((response) => {
            return response.data
        })
        .catch((error) => {
            msgType = 'error'
            console.log(error)
            return error.response.data
        })
        setFlashMessage(data.message, msgType)
    }

  return (
    <section>
        <div className={styles.addpet_header}>
            <h1>Editando o Pet: {pet.name}</h1>
            <p>Atualizando dados no sistema</p>
        </div>
        {pet.name && (
            <PetForm handleSubmit={updatePet} petData={pet} btnText="Editar"/>
        )}
    </section>
  )
}

export default EditPet
