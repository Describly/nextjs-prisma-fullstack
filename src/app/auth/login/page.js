"use client"
import { Col, Row } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {yupResolver} from "@hookform/resolvers/yup";
import {useForm} from "react-hook-form";
import * as yup from "yup";
import {signIn} from "next-auth/react"
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required()
});

const LoginPage = () => {
    const router = useRouter()
    const {data: session, status} = useSession();
    const {
        setError,
        register,
        handleSubmit,
        formState: {errors}
    } = useForm({resolver: yupResolver(schema)})


    const handleUserLogin = async (data) => {
        signIn('credentials', {
            redirect: false,
            email: data.email,
            password: data.password
        }).then(res => {
            if(res.ok) {
                toast.success("Login Successful")
                router.push('/')
            } else {
                setError("email", {"message": res?.error ?? "Unable to login.", type: "error"})
            }
        })
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
                <Form onSubmit={handleSubmit(handleUserLogin)} autoComplete='off'>
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
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Login
                    </Button>
                    </Form>
                </Col>
            </Row>
            <Row className="justify-content-center">
                <Col className="col-6 row-cols-12">
                    <Button type={"button"} variant="outline-primary mt-3" onClick={() => signIn('github', {callbackUrl: '/'})}>Login with GitHub</Button>
                </Col>
            </Row>
        </>
    )
}

export default LoginPage;