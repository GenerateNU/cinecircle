interface CommentProps {
    id: string;
    userId: string
    ratingId?: string;
    postId?: string;
    content: string;
    createdAt: string;
    parentId?: string;
    // Children comments
    nestLevel: number;
}


const Comment = ({}: CommentProps) => {
    console.log("hello");
};

export default Comment;