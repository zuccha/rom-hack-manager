import { migrate } from "../../store/_migrations";
import render from "../render";
import MainHome from "./MainHome";

migrate();

render(<MainHome />);
