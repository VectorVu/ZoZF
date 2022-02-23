import {addUserLikedByEmail, removeUserUnLiked, addPostToList,getUserByEmail,  removePostToList} from "../../../firebase/store.js"
import {getCurrentUser} from "../../../firebase/auth.js"
import * as _noti from "../../../../common/notify.js"
import  post  from "./post.js";
import db from "../../../firebase/firestore.js"
class listPost{
  
    $listPostContain;
 
    $postItems;
    
    $objItems={};

    constructor(){
       
        this.$listPostContain = document.createElement("div");
        this.$listPostContain.classList.add("cs-listPost","d-flex");

        // this.fetchPost();
        this.setUpPostListener();

    }
    handleUpdate =()=>{

    }
    handleDelete=()=>{

    }
    handleLike = async (liked, post)=>{
      try {
      const userLike = getCurrentUser(); 
      const uData = await getUserByEmail(userLike.email);  
      if(liked === true){
          await addUserLikedByEmail(post, userLike.email);
          await addPostToList(uData, post.id, "addNewLike");
      }
      else if(liked === false){
          await removeUserUnLiked(post, userLike.email);
          await removePostToList(uData, post.id);
      }
      } catch (error) {
        _noti.error(error.code, error.message);
      }
      
    }
    
    handleCmt=()=>{
        
    }
    setUpPostListener() {
      
      db.collection("post")
        .orderBy("updateAt", "desc")
        .onSnapshot((snapshot) => {
          snapshot.docChanges().forEach((change) => {
           if(change.type==="added"){
            const newPost = {
              ...change.doc.data(),
              id: change.doc.id,
            };
           const addedPost = new post(
              newPost,
              this.handleUpdate,
              this.handleDelete,
              this.handleLike,
              this.handleCmt
            );
            this.$objItems[change.doc.id] = addedPost;
            this.addPostIDToList(change.doc.data().author,change.doc.id);
            this.$listPostContain.append(addedPost.render());
           }
            if (change.type === "modified") {
              console.log(change.type);
              if (this.$objItems[change.doc.id]) {
                this.$objItems[change.doc.id].setUpData(
                  {
                    ...change.doc.data(),
                    id: change.doc.id,
                  },
                  this.handleUpdate,
                  this.handleDelete,
                  this.handleLike,
                  this.handleCmt
                
                );
              }
            }
            if (change.type === "removed") {
              this.$objItems[change.doc.id].unMount();
            }
          });
        });
    }
    addPostIDToList = async(AuthorEmail,id)=>{
      let user = getCurrentUser();
      let userDT = await getUserByEmail(user.email);
      if(AuthorEmail===user.email){
        if(!userDT.postList.includes(id)) await addPostToList(userDT, id, "addNewPost");
      }
    }
   
  
    render(){
      return this.$listPostContain;              
    }

}
export default listPost;