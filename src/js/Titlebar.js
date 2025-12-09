import { Link } from "react-router-dom";
import { 
  Container,
  Navbar,
  Image
} from "react-bootstrap";
import TitlebarImage from "../img/title4.jpg";
import "../css/nav.css";

export default function Titlebar() {
  return (
    <Container id="banner-pos" className="">
      <Link to="/">
        <Navbar className="justify-content-center">
          <Image fluid src={TitlebarImage} id="img-offset" />
        </Navbar>
      </Link>
    </Container>
  );
}