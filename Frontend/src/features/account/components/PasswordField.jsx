import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import Field from "@/features/account/components/Field";

const PasswordField = (props) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Field
      icon={Lock}
      {...props}
      type={isVisible ? "text" : "password"}
      endAdornment={
        <button
          type="button"
          aria-label={isVisible ? "Hide password" : "Show password"}
          onClick={() => setIsVisible((prev) => !prev)}
          className="text-neutral-400 transition-colors hover:text-neutral-800"
        >
          {isVisible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      }
    />
  );
};

export default PasswordField;
