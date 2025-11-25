/*
Holy fuck this components got layers

Get post/rating id

Filter by post/rating id + comments w/ no parents

Iterate through every parentless comment with matching id
    - Let recursion handle the children
    - Add a check where it's like: if nest level >= 3, then dont load
      kids and add the "view discussion button"


*/

import Comment from "./Comment"

const CommentSection = () => {
    <Comment />
}