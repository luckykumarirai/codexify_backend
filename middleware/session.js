module.exports = testlikedata (req, res, next) => {
    try {
        axios.put(`http://localhost:5000/updateLikeCount/${postId}`,{
            action : 'Like'
          })
          .then((response) => {
            console.log(response);  
          })
          .catch((error) => {
            console.log(error);
           });
        next();
    } 
    catch (error) {
        res.status(401).json({ error: error, message: "Auth failed!" });
    }
  };