"use client";
import Link from 'next/link';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import { signOut, useSession } from 'next-auth/react';

export default function MyNavbar() {
    const {data: session, status} = useSession();
    if(status === 'loading') {
        return null;
    }

    return (
        <Navbar className="bg-body-tertiary">
        <Container>
            <Link href="/"><Navbar.Brand>FullStack NextJS</Navbar.Brand></Link>
            <Navbar.Toggle />
            <Navbar.Collapse className="justify-content-end">
            {status === 'authenticated' ? (
                <>
                <Navbar.Text>
                    Signed in as: {session?.user?.name} - <span onClick={() => signOut({redirect: "/"})}>Logout</span>
                </Navbar.Text>
                </>
            ) : (
                <>
                <Stack direction="horizontal" gap={3}>
                <Link href={"/auth/login"}>
                <Button variant="primary">Login</Button>
                </Link>
                <Link href={"/auth/register"}>
                <Button variant="outline-primary">Register</Button>
                </Link>
            </Stack>
                </>
            )}
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}