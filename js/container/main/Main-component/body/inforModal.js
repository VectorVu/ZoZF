import { getUserByEmail } from "../../../firebase/store.js";

class userInfo {
  $container;

  $avatar;

  $subContainer;

  $infoContainer;
  $name;
  $email;
  $phone;

  $scoreContainer;
  $numberOfLikes;
  $numberOfPosts;
  $numberOfComments;
  $contributionScore;
  $rank;
  $leftSide;

  constructor(email) {
    //containers
    this.$container = document.createElement("div");
    this.$container.classList.add("cs-uInforArea" , "d-flex");
   
    

    //Left side: Avatar
    this.$leftSide=document.createElement("div");
    this.$leftSide.classList.add("leftSide");
    this.$avatar = document.createElement("div");
    this.$avatar.classList.add("cs-avaModal");
    this.$rank = document.createElement("div");
    this.$rank.style.margin="5px"

    //Right side: the right side contains information about users (name, email, number)
    //and the user's level point (numbers of likes, comments, posts, which contribute to the overal level score)
    this.$subContainer = document.createElement("div");
    this.$subContainer.classList.add("cs-subModal");

    //Right side: Container for user's information
    this.$infoContainer = document.createElement("div");
    this.$infoContainer.classList.add("cs-subModal");
    this.$name = document.createElement("div");
    this.$name.classList.add("cs-name");
    // this.$email = document.createElement("div");
    // this.$email.classList.add("");
    // this.$phone = document.createElement("div");
    // this.$phone.classList.add("");

    //Right side: Container for user's level and score
    this.$scoreContainer = document.createElement("div");
    // this.$scoreContainer.classList.add("");
    this.$numberOfLikes = document.createElement("div");
    // this.$numberOfLikes.classList.add("");
    this.$numberOfPosts = document.createElement("div");
    // this.$numberOfPosts.classList.add("");
    this.$numberOfComments = document.createElement("div");
    // this.$numberOfComments.classList.add("");
    this.$contributionScore = document.createElement("div");
    this.$contributionScore.classList.add("cs-name");

    this.fillUserData(email);
  }
  fillUserData = async (email) => {
    const userData = await getUserByEmail(email);
    this.$avatar.style.backgroundImage = `url(${userData.imageUrl})`;
    this.$name.innerText = userData.name;
    // this.$email.innerText = "Email: " + userData.email;
    // this.$phone.innerText = "Number: " + userData.phone;
    this.$numberOfLikes.innerText = "Like: " + userData.likeList.length;
    this.$numberOfComments.innerText = "Comment: " + userData.cmtList.length;
    this.$numberOfPosts.innerText = "Post: " + userData.postList.length;
    this.$contributionScore.innerText ="Level: "+ this.calcContributionScore(
      userData.likeList.length,
      userData.cmtList.length,
      userData.postList.length
      // <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      // <img src="https://img.icons8.com/small/32/000000/star-half-empty.png"/>
      // <img src="https://img.icons8.com/small/32/000000/star.png"/>
    );
  };

  calcContributionScore = (numberOfLikes, numberOfComments, numberOfPosts) => {
    let score = numberOfLikes + numberOfComments * 3 + numberOfPosts * 10;
    let level;
    if (score == 0) {
      level = "New Comer";
      this.$rank.innerHTML=`
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/star.png"/>
      <img src="https://img.icons8.com/small/32/000000/star.png"/>`;
  }
    else if (score > 0 && score <= 30) {
      level = "Rookie";
      this.$rank.innerHTML=`
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/star-half-empty.png"/>
      <img src="https://img.icons8.com/small/32/000000/star.png"/>`;
  }
    else if (score > 30 && score <= 100) {
      level = "Intermidiate";
      this.$rank.innerHTML=`
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/star.png"/>`;
    }
    else if (score > 100) {
      level = "Elite";
      this.$rank.innerHTML=`
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/filled-star.png"/>
      <img src="https://img.icons8.com/small/32/000000/star-half-empty.png"/>`;
    }
    return level;
  };

  render() {
    this.$container.append(this.$leftSide, this.$subContainer);
    this.$leftSide.append(this.$avatar, this.$rank);
    this.$subContainer.append(this.$infoContainer);
    this.$infoContainer.append(this.$name, this.$scoreContainer);
    this.$scoreContainer.append(
      this.$numberOfLikes,
      this.$numberOfComments,
      this.$numberOfPosts,
      this.$contributionScore
    );

    return this.$container;
  }
}

export default userInfo;