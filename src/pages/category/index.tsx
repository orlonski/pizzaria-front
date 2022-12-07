import * as React from 'react';
import { canSSRAuth } from '../../utils/canSSRAuth'
import { useState, FormEvent } from 'react'
import Head from "next/head";
import { Header } from '../../components/Header'
import styles from './styles.module.scss'
import Paper from '@mui/material/Paper';

import { setupAPIClient } from '../../services/api'
import { toast } from 'react-toastify'
import Divider from '@mui/material/Divider';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';


type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps {
    categoryList: ItemProps[];
}

export default function Category({ categoryList }: CategoryProps) {
    const [name, setName] = useState('')
    const [categories, setCategories] = useState(categoryList || [])

    async function handleRegister(event: FormEvent) {
        event.preventDefault();

        if (name === '') {
            toast.warning('Informe uma categoria')
            return;
        }

        const apiClient = setupAPIClient();
        let res = await apiClient.post('/category', {
            name
        })

        toast.success('Categoria cadastrada com sucesso')
        setName('')
        setCategories(oldArray => [...oldArray, res.data])

    }

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'left',
        color: theme.palette.text.secondary,
    }));

    return (
        <>
            <Head>
                <title>Nova categoria - Sujeito Pizzaria</title>
            </Head>
            <div>
                <Header />

                <main className={styles.container}>
                    <h1>Cadastrar categorias</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <input
                            type="text"
                            placeholder="Digite o nome da categoria"
                            className={styles.input}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type="submit">
                            Cadastrar
                        </button>
                    </form>

                    <Box sx={{ width: '100%' }}>
                        <Stack spacing={1}>

                            {categories.map(item => (
                                <Item key={item.id} >{item.name}</Item>
                            ))}

                        </Stack>
                    </Box>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {

    const apiClient = setupAPIClient(ctx)
    const response = await apiClient.get('/category');

    return {
        props: {
            categoryList: response.data
        }
    }
})