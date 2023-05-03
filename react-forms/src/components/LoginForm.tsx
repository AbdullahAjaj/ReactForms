import React, { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import { FieldErrors } from 'react-hook-form/dist/types';

let renderedCount = 0;

type formValues = {
  username: string,
  email: string,
  age: number,
  social: {
    facebook: string,
    linkedin: string
  },
  phoneNumbers: string[],
  skills: {
    skillName: string
  }[]
}

const LoginForm = () => {

  renderedCount++
  
  const form = useForm<formValues>({
    defaultValues : {
      username: "Abdullah",
      email: "aa@gmail.com",
      age: 0,
      social: {
        facebook: "",
        linkedin: "",
      },
      phoneNumbers: ["", ""],
      skills: [{ skillName: "" }]
    }
    // , mode: "onBlur"
  })
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form
  const { errors, isDirty, dirtyFields, touchedFields, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState

  console.log("isDirty ", isDirty," dirrtyFields ", dirtyFields," touchedField ", touchedFields)
  console.log({ isSubmitted, isSubmitSuccessful, submitCount })

  const { fields, append, remove } = useFieldArray({
    name: "skills",
    control
  })

  // const watchForm = watch()
  // useEffect(()=>{
  //   const subscription = watch(value =>{
  //     console.log(value)
  //   })
  //   return ()=> subscription.unsubscribe()
  // }, [watch])

  function onSubmit(data: formValues){
    console.log("Form Submitted", data)
  }
  function onError(errors: FieldErrors<formValues>){
    console.log("Form Errors", errors)
  }

  useEffect(()=>{
    if(isSubmitSuccessful) reset()
  }, [isSubmitSuccessful, reset])

  function handleGetValues(){
    console.log("Form values:::: " , getValues(["username", "age"]))
  }
  function handleSetValue(){
    setValue("username", "", {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true
    })
  }

  return (
    <>
      <h1>{renderedCount/2}</h1>
      {/* <h2>{JSON.stringify(watchForm)}</h2> */}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>

        <div className='form-control'>
          <label htmlFor='username'>Username</label>
          <input type="text" id="username" {...register("username", {
            required: "username is required"
          })} />
          <p>{errors.username?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='email'>Email</label>
          <input type="text" id="email" {...register("email", {
            pattern: {
              value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
              message: "invalid email format"
            },
            validate: {
              notAdmin: (fieldValue) =>{
                return fieldValue !== "abdollahmjajaj@gmail.com" || "Enter a defferent email address"
              }
            }
          })} />
          <p>{errors.email?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='age'>Age</label>
          <input type="text" id="age" {...register("age", {
            required: "Age is required",
            valueAsNumber: true
          })} />
          <p>{errors.age?.message}</p>
        </div>

        <div className='form-control'>
          <label htmlFor='facebook'>Facebook</label>
          <input type="text" id="facebook" {...register("social.facebook", {
            disabled: true,
            required: true
          })} />
          {errors.social?.facebook && <p>Facebook profile is required</p>}
        </div>

        <div className='form-control'>
          <label htmlFor='linkedin'>Linkedin</label>
          <input type="text" id="linkedin" {...register("social.linkedin", {
            disabled: watch("username") === ""
          })} />
        </div>

        <div className='form-control'>
          <label htmlFor='primaryNumber'>Primary Number</label>
          <input type="text" id="primaryNumber" {...register("phoneNumbers.0", {
            required: true,
          })} />
          {errors.phoneNumbers && <p>Primary number is required</p>}
        </div>

        <div className='form-control'>
          <label htmlFor='secondaryNumber'>Secondary Number</label>
          <input type="text" id="secondaryNumber" {...register("phoneNumbers.1")} />
        </div>

        <div>
          <label>List of skills</label>
          {fields.map((skill, index) => {
            return(
              <div className='form-control' key={skill.id}>
                <input type="text" {...register(`skills.${index}.skillName` as const)} />
                {
                  index > 0 && (
                    <button type="button" onClick={()=> remove(index)}>Remove skill</button>
                  )
                }
              </div>
            )
          })}
          <button type="button" onClick={()=> append({ skillName: "" })}>Add skill</button>
        </div>


        <button disabled={ !isDirty || !isValid || isSubmitting }>Submit</button>
        <button type='button' onClick={()=> reset()}>Reset</button>
        <button type='button' onClick={handleGetValues}>Get Values</button>
        <button type='button' onClick={handleSetValue}>Set Value</button>
        <button type='button' onClick={()=> trigger("email")}>Trigger</button>
      </form>
      <DevTool control={control} />
    </>
  )
}

export default LoginForm