import { CommentProvider } from "./context/CommentProvider";
import Comments from "./features/comments/Comments";
import "./index.css";

function App() {
  return (
    <CommentProvider>
      <Comments />
    </CommentProvider>
  );
}

export default App;
