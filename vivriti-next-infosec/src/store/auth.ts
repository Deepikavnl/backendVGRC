import { create } from "zustand";
import axios from "axios";

export type Persona = "internal" | "vendor";


interface AuthUser {
  name: string;
  email: string;
  role: string;
  persona: Persona;
  company?: string;
  entityId?: number;
  token?: string;
}



interface AuthState {

  user: AuthUser | null;


  login: (
      email:string,
      password:string,
      persona:Persona
  ) => Promise<void>;


  logout:()=>void;

}



const stored =
    typeof window !== "undefined"
        ? localStorage.getItem("vn-auth")
        : null;



export const useAuthStore = create<AuthState>((set)=>({


  user: stored
      ? JSON.parse(stored)
      : null,



  login: async(
      email,
      password,
      persona
  )=>{


    const response =
        await axios.post(
            "http://localhost:8080/api/auth/login",
            {
              email,
              password,
              loginType:
                  persona === "internal"
                      ? "INTERNAL"
                      : "VENDOR"
            }
        );



    const data = response.data;



    console.log("LOGIN RESPONSE", data);


    const user: AuthUser = {

      name: data.name,

      email: data.email,

      role: data.role,

      persona:
          data.role === "VENDOR"
              ? "vendor"
              : "internal",

      company: data.entity?.name,

      entityId: data.entity?.id,

      token: data.token

    };

    localStorage.setItem(
        "vn-auth",
        JSON.stringify(user)
    );



    set({
      user
    });



  },



  logout:()=>{


    localStorage.removeItem(
        "vn-auth"
    );


    set({
      user:null
    });


  }


}));