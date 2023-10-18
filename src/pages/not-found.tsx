import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const NotFound = () => {
  return (
    <div className="h-screen w-full overflow-hidden flex flex-col items-center justify-center">
      <img
        src="https://firebasestorage.googleapis.com/v0/b/chat-f60b9.appspot.com/o/undraw_page_not_found_re_e9o6.svg?alt=media&token=3c368b5a-7a5e-44ae-a931-348646859164&_gl=1*g4p71e*_ga*NzE3OTE0NDQ0LjE2OTc1MjQ0MDc.*_ga_CW55HF8NVT*MTY5NzU5MjIzMi4zLjEuMTY5NzU5MjI1MS40MS4wLjA."
        alt="error"
        className="max-w-[30%]"
      />
      <Link
        to="/"
        className="underline underline-offset-4 hover:text-primary mt-6"
      >
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};
