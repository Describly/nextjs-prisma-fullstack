"use client"
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().required()
});

const RegisterPage = () => {
    const router = useRouter()
    const {data: session, status} = useSession();
    const {
        setError,
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({resolver: yupResolver(schema)})

    const handleUserRegister = async (data) => {
        const rawResponse = await fetch("/api/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        if (rawResponse.ok) {
            toast.success("Your account has been registered.")
        } else {
            const json = await rawResponse.json()
            setError("email", {"message": json?.detail ?? "Oops! Unable to create account.", "type": "error"})
        }
    }

    if (status == "loading") {
        return null;
    }

    if(status == "authenticated") {
        router.push('/')
    }

    return (
        <>
        <Row className='justify-content-center pt-5'>
                <Col className='col-6 row-cols-12'>
                <Form onSubmit={handleSubmit(handleUserRegister)} autoComplete='off'>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" {...register('name')} placeholder="John Doe" />
                        <Form.Text className="text-danger">{errors.name?.message}</Form.Text>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" {...register('email')} placeholder="Enter email" />
                        <Form.Text className="text-danger">{errors.email?.message}</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" {...register('password')} placeholder="Password" />
                        <Form.Text className="text-danger">{errors.password?.message}</Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Register
                    </Button>
                    </Form>
                </Col>
            </Row>
        </>
    )
}

export default RegisterPage;