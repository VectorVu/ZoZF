import db from "./firestore.js";
import * as _noti from "../../common/notify.js";

async function createUser(email, name, phone, imageUrl, likeList, cmtList,postList) {
    try {
        const response = await db.collection("users").add({
            email,
            name,
            phone,
            imageUrl,
            likeList,
            cmtList,
            postList
        });
        localStorage.removeItem("auth-info");
        localStorage.setItem("auth-info", JSON.stringify({
            email,
            name,
            phone,
            imageUrl,
            likeList,
            cmtList,
            postList
        }));
        console.log(response);

    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        // ..
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function getUserByEmail(email) {
    try {
        const querySnapshot = await db
            .collection("users")
            .where("email", "==", email)
            .get();
        if (querySnapshot.docs.length === 0) {
            return null;
        }
        return {
            id:querySnapshot.docs[0].id,
            ...querySnapshot.docs[0].data(),
        }
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}

async function updateUserData( uid, email, name, phone, imageUrl) {
    try {
        const reponse = await db
            .collection("users")
            .doc(uid)
            .update({
                email,
                name,
                phone,
                imageUrl
            });
            localStorage.removeItem("auth-info");
            localStorage.setItem("auth-info", JSON.stringify({
                email,
                name,
                phone,
                imageUrl
            }));
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function createPost(content,imgUrl, author,likedList, cmtList){
    try {
        const reponse = await db.collection("post").add({
            content,
            imgUrl,
            author,
            likedList,
            cmtList,
           
            updateAt: firebase.firestore.FieldValue.serverTimestamp()
        })
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error; 
    }
}


async function deleteChat(id){
    try {
        await db.collection("chat").doc(id).delete();
        
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function updateChat(id, name, imageUrl, users, email){
    try {
        const reponse = await db.collection("chat").doc(id).update({
            name,
            imageUrl,
            users,
            creator:email,
            updateAt: new Date().getTime()
        })
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error; 
    }
}
async function addUserLikedByEmail(post, newEmail){
    try {
        
        const reponse = await db
            .collection("post")
            .doc(post.id)
            .update({
                ...post,
                likedList:[...post.likedList, newEmail],
            });
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function addCommentToPost(post, newID){
    try {
        
        const reponse = await db
            .collection("post")
            .doc(post.id)
            .update({
                ...post,
                cmtList:[...post.cmtList, newID],
            });
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function addPostToList(userData, newID, type){
    try {
        
        const reponse = await db
            .collection("users")
            .doc(userData.id)
            if(type ==="addNewLike"){
                reponse.update({
                    ...userData,
                    likeList:[...userData.likeList, newID],
                });
            }
            else if(type ==="addNewPost"){
                console.log(userData);
                reponse.update({
                    ...userData,
                    postList:[...userData.postList, newID]
                });
            }
            
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function removePostToList(userData, postID){
    try {
        
        const reponse = await db
            .collection("users")
            .doc(userData.id)
            .update({
                ...userData,
                likeList:firebase.firestore.FieldValue.arrayRemove(postID),
            });
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
async function removeUserUnLiked(post, Email){
    try {
        
        const reponse = await db
            .collection("post")
            .doc(post.id)
            .update({
                ...post,
                likedList:firebase.firestore.FieldValue.arrayRemove(Email)
            });
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}

async function sendComment (sender,senderEmail, content, postID, imgUrl){
    try {
        const reponse = await db.collection("comment").add({
            sender,
            senderEmail, 
            content, 
            postID,
            sendAt: firebase.firestore.FieldValue.serverTimestamp(),
            avaSend: imgUrl
        });
    } catch (error) {
        let errorCode = error.code;
        let errorMessage = error.message;
        console.log(errorCode, errorMessage);
        throw error;
    }
}
export { 
    createUser, 
    getUserByEmail, 
    updateUserData, 
    createPost, 
    updateChat, 
    deleteChat,
    sendComment,
    addUserLikedByEmail,
    removeUserUnLiked,
    addCommentToPost,
    addPostToList,
    removePostToList
} 