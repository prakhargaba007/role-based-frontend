import { Button } from "@mantine/core";
import Link from "next/link";
import classes from "./LoginOrSignUpPage.module.css";
const LoginOrSignUpPage = () => {
  return (
    <div>
      <h2>Register yourself to create notes.</h2>
      <div className={classes.container}>
        <Link href="/user/login">
          <Button variant="outline">Login</Button>
        </Link>
        <Link href="/user/signup">
          <Button variant="filled">Sign Up</Button>
        </Link>
      </div>
    </div>
  );
};

export default LoginOrSignUpPage;
