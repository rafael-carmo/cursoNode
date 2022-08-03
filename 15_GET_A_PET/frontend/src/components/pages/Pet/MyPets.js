import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import api from '../../../utils/api'

/* hooks */
import useFlashMessage from '../../../hooks/useFlashMessage'

import styles from './Dashboard.module.css'
import RoundedImage from '../../layout/RoundedImage'

const MyPets = () => {
    const [pets, setPets] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');
    const { setFlashMessage } = useFlashMessage()

    useEffect(() => {
        api.get('/pets/mypets', {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`
            },
        }).then((response) => {
            console.log(response)
            setPets(response.data.pets)
        })
    }, [token]);

    const concludeAdoption = async (id) => {
        let msgType = 'success'

        const data = await api.patch(`/pets/conclude/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
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

    const removePet = async (id) => {
        let msgType = 'success'

        const data = await api.delete(`/pets/${id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(token)}`,
            },
        })
        .then((response) => {
            const updatedPets = pets.filter((pet) => pet._id !== id)
            setPets(updatedPets)
            return response.data
        })
        .catch((error) => {
            msgType = 'error'
            return error.response.data
        })
        console.log(data)
        setFlashMessage(data.message, msgType)
    }

    return (
        <section>
            <div className={styles.petslist_header}>
                <h1>Meus Pets Cadastrados</h1>
                <Link to='/pet/add' >Cadastrar Pet</Link>
            </div>
            <div className={styles.petlists_container}>
                {pets.length > 0 &&
                    pets.map((pet) => (
                        <div key={pet._id} className={styles.petlist_row}>
                            <RoundedImage
                                src={`${process.env.REACT_APP_API}/images/pets/${pet.images[0]}`}
                                alt={pet.name}
                                width="px75"
                            />
                            <span className="bold">{pet.name}</span>
                            <div className={styles.actions}>
                                {pet.available ? (
                                    <>
                                        {pet.adopter && (
                                            <button
                                                className={styles.conclude_btn}
                                                onClick={() => {
                                                    concludeAdoption(pet._id)
                                                }}
                                            >
                                                Concluir Adoção
                                            </button>
                                        )}
                                        <Link to={`/pet/edit/${pet._id}`}>Editar</Link>
                                        <button
                                            onClick={() => {
                                                removePet(pet._id)
                                            }}
                                        >
                                            Excluir
                                        </button>
                                    </>
                                ) : (
                                    <p>Pet já adotado</p>
                                )}
                            </div>
                        </div>
                    ))
                }
                {pets.length === 0 && <p>Não há Pets cadastrados</p>}
            </div>
        </section>
    )
}

export default MyPets
