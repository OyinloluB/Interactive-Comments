import Comment from "./Comment";

const Comments = () => {
  return (
    <div className="flex justify-center min-h-screen sm:py-20 px-5 py-10 font-rubik bg-background ">
      <div className="space-y-6">
        <Comment />
        <Comment />
        <Comment />
      </div>
    </div>
  );
};

export default Comments;
