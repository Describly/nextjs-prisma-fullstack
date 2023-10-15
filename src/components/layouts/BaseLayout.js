import { Container } from "react-bootstrap";
import MyNavbar from "./MyNavbar";


export default function BaseLayout({children}) {
    return (
        <Container>
            <MyNavbar />
            {children}
        </Container>
    );
}