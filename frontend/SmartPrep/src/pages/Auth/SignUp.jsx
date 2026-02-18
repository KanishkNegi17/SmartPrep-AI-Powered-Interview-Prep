import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Cards/Inputs/Input'
import ProfilePhotoSelector from '../../components/Cards/Inputs/ProfilePhotoSelector'
import { validateEmail } from '../../utils/helper'
import { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import uploadImage from '../../utils/uploadImage'

const SignUp = ({setCurrentPage}) => {
  const [profilePic,setProfilePic] = useState(null)
  const [fullName,setFullName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  const [error, setError] = useState(null) 
  
  const {updateUser} = useContext(UserContext)
  const navigate = useNavigate()
  
  //Handle SignUp
  const handleSignUp = async (e)=>{
    e.preventDefault() 

    let profileImageURL =""
    if(!fullName){
      setError("Please Enter Full Name.")
      return
    }

    if(!validateEmail(email)){
      setError("Please Enter A Valid Email.")
      return
    }

    if(!password){
      setError("Please Enter Password")
      return
    }

    setError("")

    //SignUp API Call
    try {
      //upload image if present 
      if (profilePic){
        const imgUploadRes = await uploadImage(profilePic)
        console.log("Image upload response:", imgUploadRes);
 
        profileImageURL = imgUploadRes.imageUrl || ""
        console.log(profileImageURL);
      }
      console.log(profileImageURL);
      
      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER,{
        name: fullName,
        email,
        password,
        profileImageURL,
      })

      const {token} = response.data
      
      if(token){
        localStorage.setItem("token",token)
        updateUser(response.data)
        navigate("/dashboard")
      }

    } catch (error) {
      if(error.response && error.response.data.message){
        setError(error.response.data.message)
      }else{
        setError("Something Went Wrong. Please Try Again!!!")
      }
    }
  }

  return (
    <div className='w-[90vw] md:w-[33vw] p-7 flex flex-col justify-center'>
      <h3 className='text-lg font-semibold text-black'>Create An Account</h3>
      <p className='text-xs text-slate-700 mt-[5px] mb-6'>
        Join Us Today by Entering Your Details.
      </p>
      <form  onSubmit={handleSignUp}>

        <ProfilePhotoSelector image={profilePic} setImage = {setProfilePic}/>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
        <Input
        value={fullName}
        onChange={({target})=>  setFullName(target.value)}
        label = "Full Name"
        placeholder = "john"
        type = "text"
        />

        <Input
        value={email}
        onChange={({target})=>  setEmail(target.value)}
        label = "Email Address"
        placeholder = "john@example.com"
        type = "text"
        />

        <Input
        value={password}
        onChange={({target})=>  setPassword(target.value)}
        label = "Password"
        placeholder = "Min 8 Characters"
        type = "password"
        />
        </div>

        {error && <p  className='text-red-500 text-xs pb-2.5'>{error}</p>}

        <button type='submit' className='btn-primary'>
          SignUP
        </button>

        <p className='text-[13px] text-slate-800 mt-3'>
          Already Have An Account?{" "}
          <button
          className='font-medium text-primary underline cursor-pointer'
          onClick={()=>{
            setCurrentPage("login")
          }}
          >
            Login
          </button>
        </p>

      </form>

    </div>
  )
}

export default SignUp