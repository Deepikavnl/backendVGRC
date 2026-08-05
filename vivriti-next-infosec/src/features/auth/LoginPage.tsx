import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Building2,
  UserCog,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { useAuthStore } from "@/store/auth";
import { LOGO_URL } from "@/lib/utils";


export function LoginPage() {

  const { login } = useAuthStore();

  const navigate = useNavigate();


  const [persona, setPersona] =
      useState<"internal" | "vendor">("internal");


  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [remember, setRemember] = useState(true);

  const [error, setError] = useState("");



  const submit = async (e: React.FormEvent) => {

    e.preventDefault();


    try {

      setError("");


      await login(
          email,
          password,
          persona
      );


      const user =
          useAuthStore.getState().user;



      if (!user) {
        return;
      }



      switch(user.role) {


        case "ADMIN":

          navigate("/dashboard");

          break;



        case "REVIEWER":

          navigate("/reviewer");

          break;



        case "VENDOR":

          navigate("/vendor");

          break;



        default:

          navigate("/dashboard");

      }



    } catch(err:any) {


      setError(
          err.response?.data?.message ||
          "Invalid email or password"
      );

    }

  };



  return (

      <div className="flex min-h-screen">


        {/* Brand Panel */}

        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-950 p-12 text-white lg:flex">


          <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                    "radial-gradient(circle at 20% 20%, white 1px, transparent 1px)",
                backgroundSize:"28px 28px"
              }}
          />


          <div className="relative flex items-center gap-3">


            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white p-1.5">

              <img
                  src={LOGO_URL}
                  alt="Vivriti NEXT"
                  className="h-full w-full object-contain"
              />

            </div>


            <div>

              <p className="text-lg font-bold leading-tight">
                Vivriti NEXT InfoSec
              </p>

              <p className="text-xs text-white/60">
                Governance, Risk & Compliance
              </p>

            </div>


          </div>




          <div className="relative max-w-md">


            <h1 className="text-3xl font-bold leading-snug">

              Third-Party Security Posture Management

            </h1>


            <p className="mt-4 text-white/70">

              Assess, monitor and govern the security posture
              of every vendor, supplier and partner —
              from a single, audit-ready platform.

            </p>



            <div className="mt-8 grid grid-cols-3 gap-4">


              {[
                ["100+","Vendors"],
                ["500+","Controls"],
                ["ISO 27001","Aligned"]
              ].map(([a,b])=>(


                  <div
                      key={b}
                      className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >

                    <p className="text-xl font-bold">
                      {a}
                    </p>

                    <p className="text-xs text-white/60">
                      {b}
                    </p>

                  </div>


              ))}


            </div>


          </div>



          <p className="relative text-xs text-white/40">

            © 2026 Vivriti NEXT Limited · Internal InfoSec Platform

          </p>


        </div>

        <div className="flex w-full items-center justify-center p-6 lg:w-1/2">


          <div className="w-full max-w-sm">

            <div className="mb-8 flex items-center gap-2 lg:hidden">


              <img
                  src={LOGO_URL}
                  alt="Vivriti NEXT"
                  className="h-8"
              />

              <span className="font-bold">
              Vivriti NEXT InfoSec
            </span>


            </div>

            <h2 className="text-2xl font-bold tracking-tight">

              Sign in

            </h2>

            <p className="mt-1 text-sm text-muted-foreground">

              Access the GRC platform with your credentials.

            </p>






            {/* Persona Selection */}


            <div className="mt-6 grid grid-cols-2 gap-2 rounded-lg border bg-muted/40 p-1">



              <button

                  type="button"

                  onClick={() =>
                      setPersona("internal")
                  }

                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium ${
                      persona==="internal"
                          ?"bg-card text-foreground shadow-sm"
                          :"text-muted-foreground"
                  }`}

              >

                <UserCog className="h-4 w-4"/>

                Internal

              </button>




              <button

                  type="button"

                  onClick={() =>
                      setPersona("vendor")
                  }

                  className={`flex items-center justify-center gap-2 rounded-md py-2 text-sm font-medium ${
                      persona==="vendor"
                          ?"bg-card text-foreground shadow-sm"
                          :"text-muted-foreground"
                  }`}

              >

                <Building2 className="h-4 w-4"/>

                Vendor

              </button>



            </div>






            <form
                onSubmit={submit}
                className="mt-6 space-y-4"
            >



              <div className="space-y-1.5">


                <Label>
                  Email address
                </Label>



                <div className="relative">


                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>



                  <Input

                      type="email"

                      value={email}

                      onChange={(e)=>
                          setEmail(e.target.value)
                      }

                      className="pl-9"

                      placeholder="Enter email"

                  />


                </div>


              </div>






              <div className="space-y-1.5">


                <Label>
                  Password
                </Label>


                <div className="relative">


                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/>


                  <Input

                      type="password"

                      value={password}

                      onChange={(e)=>
                          setPassword(e.target.value)
                      }

                      className="pl-9"

                      placeholder="Enter password"

                  />


                </div>


              </div>





              {
                  error && (

                      <p className="text-sm text-red-500">

                        {error}

                      </p>

                  )
              }







              <div className="flex items-center gap-2">


                <Checkbox

                    checked={remember}

                    onCheckedChange={(v)=>
                        setRemember(Boolean(v))
                    }

                />


                <Label className="text-sm font-normal text-muted-foreground">

                  Keep me signed in

                </Label>


              </div>






              <Button
                  type="submit"
                  className="w-full"
                  size="lg"
              >

                Sign in

                <ArrowRight className="h-4 w-4"/>

              </Button>





            </form>






            <div className="mt-6 flex items-start gap-2 rounded-lg border bg-accent/50 p-3 text-xs text-muted-foreground">


              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary"/>


              <p>

                Secure GRC platform login.

              </p>


            </div>




          </div>


        </div>



      </div>

  );

}