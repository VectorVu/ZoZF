import ButtonComponent from "../../../../component/button.js"
import * as _noti from "../../../../common/notify.js";
import { sendComment } from "../../../firebase/store.js"


class Composer{
    $container;
    $inputCmt;
    $btnSend;

    $activePost;
    $callBackCmt;

    constructor(post){
       

        this.$container = document.createElement("form");
        this.$container.classList.add("composer-contain", "d-flex");
        this.$container.addEventListener("submit", this.handleSendComment);

        this.$inputCmt = document.createElement("input");
        this.$inputCmt.type = "text";
        this.$inputCmt.placeholder="Aa";
        this.$inputCmt.classList.add("grow-1");
        this.$inputCmt.name = `cmt`;

        this.$btnSend = new ButtonComponent(
            "Send",
            ["btn", "btn-primary", "d-block"],
            "submit"
        )
        this.$activePost = post;

    }
    unMout=()=>{
        this.$container.remove();
    }

       
    
    handleSendComment = async (event)=>{
        event.preventDefault();
        try {

                const {value} = event.target.cmt;
            
                const infor = JSON.parse(localStorage.getItem("auth-info"));
                this.$inputCmt.value="";
                console.log(value);
                if(value) {
                    await sendComment(infor.name,infor.email, value, this.$activePost.id, infor.imageUrl||"");
                    
                }
               
            
        } catch (error) {
            _noti.error(error.code, error.message);
        }
      
    }
    render(){
        this.$container.append(this.$inputCmt, this.$btnSend.render());
        return this.$container;
    }
}
export default Composer;