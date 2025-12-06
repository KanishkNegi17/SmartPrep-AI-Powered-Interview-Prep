const Session = require("../models/Session")
const Question = require("../models/Question")

//@desc create new session and linked question
//@route POST api/sessions/create
//@access Private
exports.createSession = async (req,res)=>{
    try {
        const {role, experience, topicsToFocus, description, questions} = req.body
        const userId = req.user._id

        const session = await Session.create({
            user: userId,
            role,
            experience,
            topicToFocus: topicsToFocus, 
            description
        })

        const questionDocs = await Promise.all(
            questions.map(async (q)=>{
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                })
                return question._id
            })
        )

        session.questions = questionDocs
        await session.save()

        res.status(201).json({success: true, session})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error" })
    }
}

//@desc get all session for looged in user
//@route GET api/sessions/my-sessions
//@access Private
exports.getMySessions = async (req,res)=>{
    try {
        const sessions = await Session.find({user: req.user.id}).sort({createdAt: -1}).populate("questions")
        res.status(200).json(sessions)
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error" })
    }
}

//@desc get Session By Id
//@route GET api/sessions/:id
//@access Private
exports.getSessionById = async (req,res)=>{
    try {
        const session = await Session.findById(req.params.id).populate({
            path : "questions",
            options: {sort: {isPinned: -1, createdAt: 1}},
        }).exec()

        if(!session){
            return res.status(404).json({success:false, message: "Session Not Found"})
        }

         res.status(200).json({success:true, session})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error" })
    }
}

//@desc delete Session 
//@route DELETE api/sessions/:id
//@access Private
exports.deleteSession = async (req,res)=>{
    try {
        const session = await Session.findById(req.params.id)

        if(session.user.toString()!== req.user.id){
            return res.status(401).json({message: "Not Authorized to delete this session"})
        }

        //first delete all questions link to session
        await Question.deleteMany({session: session._id})

        //then delete session
        await Session.deleteOne()

        res.status(200).json({message: "Session Deleted Successfully"})
    } catch (error) {
        res.status(500).json({success:false, message:"Server Error" })
    }
}
