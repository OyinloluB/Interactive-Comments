import Comments from "./features/comments/Comments";
import "./index.css";

const initialComments = [
  {
    id: 1,
    user: "amyrobson",
    text: "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You’ve nailed the design and the responsiveness at various breakpoints works really well.",
    votes: 12,
    replies: [],
  },
  {
    id: 4,
    user: "maxblagun",
    text: "Woah, your project looks awesome! How long have you been coding for? I’m still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
    votes: 5,
    replies: [
      {
        id: 2,
        user: "ramsesmiron",
        text: "If you’re still new, I’d recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It’s very tempting to jump ahead but lay a solid foundation first.",
        votes: 4,
        replies: [],
      },
      {
        id: 3,
        user: "juliosomo",
        text: "I couldn’t agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
        votes: 2,
        replies: [],
      },
    ],
  },
];

function App() {
  return <Comments comments={initialComments} />;
}

export default App;
