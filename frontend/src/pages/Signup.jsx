import React from "react";
import { Heading } from "../components/Heading";
import { Subheading } from "../components/Subheading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";

function Signup() {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="w-80 text-center bg-white rounded-lg p-5" id="card">
          <Heading label={"Sign up"} />
          <Subheading label={"Enter your information to create an account"} />
          <InputBox placeholder={"John"} label={"First Name"} />
          <InputBox placeholder={"Doe"} label={"Last Name"} />
          <InputBox
            placeholder={"piyush.xavierite24@gmail.com"}
            label={"Email"}
          />
          <InputBox placeholder={"123456"} label={"Password"} />
          <div>
            <Button label={"Signup"} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
