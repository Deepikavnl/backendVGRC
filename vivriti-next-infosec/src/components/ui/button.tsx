import React from "react";

interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>{

  variant?:
      "default" |
      "outline" |
      "destructive" |
      "ghost";

  size?:
      "default" |
      "sm" |
      "lg" |
      "icon";

}


export const Button =
    React.forwardRef<HTMLButtonElement,ButtonProps>(
        (
            {
              children,
              variant="default",
              size="default",
              className="",
              ...props
            },
            ref
        )=>{


          return (

              <button

                  ref={ref}

                  className={`
px-4 py-2 rounded-md font-medium

${
                      variant==="destructive"
                          ?
                          "bg-red-600 text-white"
                          :
                          variant==="outline"
                              ?
                              "border"
                              :
                              variant==="ghost"
                                  ?
                                  "hover:bg-gray-100"
                                  :
                                  "bg-primary text-white"
                  }

${className}

`}

                  {...props}

              >

                {children}

              </button>

          );


        });


Button.displayName="Button";