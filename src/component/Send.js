// Tools
import {useState, useEffect} from "react";
import axios from "axios";

// Controller
import controller from "../controller/index.js";

const Send = ({messageId, closeReplyHandler, getMessageSended})=>{
    const [message, setMessage] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [imageUpload, setImageUpload] = useState("");
    const [isReply, setIsReply] = useState(messageId ? true : false);

    const messageChangeHandler = (e)=>{
        setMessage(e.target.value);
    }

    const imageChangeHandler = async (e)=>{
        const filelist = e.target.files;
        const image = filelist[0];
        
        const reader = new FileReader();

        const data = new FormData();
        data.append("image",filelist[0]);

        reader.onload = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(image);

        const result = await axios.post(
            "http://localhost:4000/uploadImage",
            data,
            {headers:{
                "Content-Type": "multipart/form-data;",
                "Accept" : "*/*",
            }}
        ).then(result=>{
            setImageUpload(result.data.path);
        })
    }

    const sendHandler = async (e)=>{
        if (!isReply){
            let result = await controller.sendMessage({content:message,image:imageUpload});
            getMessageSended(result);
        }
        else {
            let result = await controller.sendReply({content:message, image:imageUpload, replyTo:messageId})
            closeReplyHandler()
        }
        setMessage("");
        setImagePreview("");
    }

    useEffect(()=>{
    }, [imagePreview])

    useEffect(()=>{
        if (messageId){
            setIsReply(true);
        }
    }, [])

    return (
        <div className="card">
            {imagePreview ? 
                <div className="image-wrapper mb-3 w-full h-[300px] rounded-xl border-radius-full relative overflow-hidden">
                    <img className="absolute" src={imagePreview}/>
                </div> 
                : <></>
            }
            <div aria-label="input-wrapper">
                <textarea className="textarea-form" rows="5" value={message} placeholder="내용을 입력하세요." onChange={messageChangeHandler}></textarea>
            </div>
            <div className="flex justify-between align py-1">
                <label className="btn-image-upload flex flex-col justify-center">
                    <input type="file" className="image-upload-input" onChange={imageChangeHandler} accept=".jpeg, .jpg, .png, gif"/>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                    </svg>
                </label>
                <button className="btn-primary" onClick={sendHandler}>보내기</button>
            </div>
        </div>
    )
}

export default Send ;