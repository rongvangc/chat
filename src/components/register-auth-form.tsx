import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ChangeEvent, SyntheticEvent, useState } from "react";

interface RegisterAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function RegisterAuthForm({
  className,
  ...props
}: RegisterAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<string>();

  const handleUploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    file && setFile(URL.createObjectURL(file));
  };

  const onSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="name">
              Display name
            </Label>
            <Input
              id="name"
              placeholder="Username"
              type="name"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <img src={file} />
            <Input onChange={handleUploadImage} id="picture" type="file" />
          </div>

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
