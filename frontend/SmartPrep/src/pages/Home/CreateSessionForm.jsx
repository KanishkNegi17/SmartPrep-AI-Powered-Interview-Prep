import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Input from '../../components/Cards/Inputs/Input'
import SpinnerLoader from '../../components/Cards/Inputs/Layouts/Loader/SpinnerLoader'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'

const CreateSessionForm = () => {
    const [formData, setFormData] = useState({
        role:"",
        experience:"",
        topicsToFocus:"",
        description:"",
    })

    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState(null)

    const navigate = useNavigate()

    const handleChange = (key, value)=>{
        setFormData((prevData)=>({
            ...prevData,
            [key]:value,
        }))
    }

    const handleCreateSession = async (e)=>{
        e.preventDefault()

        const {role, experience, topicsToFocus} = formData

        if(!role || !experience || !topicsToFocus){
            setError("Please Fill Full Details")
            return
        }
        setError("")

        setIsLoading(true)

        try {
            //call ai API to generate Question
            const aiResponse = await axiosInstance.post(
                API_PATHS.AI.GENERATE_QUESTIONS,{
                    role,
                    experience,
                    topicsToFocus,
                    numberOfQuestions:10,
                }
            )

            //Should be array or something 
            const generatedQuestions = aiResponse.data.data
            console.log(generatedQuestions);
            
            const response = await axiosInstance.post(API_PATHS.SESSION.CREATE,{
                ...formData,
                questions: generatedQuestions,
            })

            if(response.data?.session?._id){
                navigate(`/interview-prep/${response.data?.session?._id}`)
            }

        } catch (error) {
            if(error.response && error.response.data.message){
                setError(error.response.data.message)
            }else{
                setError("Something Went Wrong. Please Try Again")
            }
        }finally{
                setIsLoading(false)
            }
    }

  return (
    <div className='w-[90vw] md:w-[35vw] p-7 flex flex-col justify-center '>
        <h3 className='text-lg font-semibold text-black'>
            Start A New Interview Journey
        </h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-3'>
            Fill out a few quick details and unlock your personalized set of interview questions!
        </p>

        <form onSubmit={handleCreateSession} className='flex flex-col gap-3'>
            <Input
            value={formData.role}
            onChange={({target})=>  handleChange("role",target.value)}
            label = "Target Role"
            placeholder = "(e.g. Fromtend Developer, UI/UX, Designer etc.)"
            type = "text"
            />

            <Input
            value={formData.experience}
            onChange={({target})=>  handleChange("experience",target.value)}
            label = "Years Of Experience"
            placeholder = "(e.g. 1 year, 2+ years etc)"
            type = "number"
            />

            <Input
            value={formData.topicsToFocus}
            onChange={({target})=>  handleChange("topicsToFocus",target.value)}
            label = "Topics to Focus on"
            placeholder = "(Comma Separated, e.g. React, Node.js, etc.)"
            type = "text"
            />

            <Input
            value={formData.description}
            onChange={({target})=>  handleChange("description",target.value)}
            label = "Description"
            placeholder = "(Any Specific Goals or notes for the session)"
            type = "text"
            />

            {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

            <button type='submit' className='btn-primary w-full mt-2' disabled={isLoading}>
                {isLoading && <SpinnerLoader/>}Create Session
            </button>

        </form>
    </div>
  )
}

export default CreateSessionForm