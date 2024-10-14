import { InfoCircledIcon } from "@radix-ui/react-icons";

interface FormInformationProps {
  message?: string;
};

export const FormInformation = ({
  message,
}: FormInformationProps) => {
  if (!message) return null;

  return (
    <div className="bg-blue-100 p-3 rounded-md flex items-center gap-x-2 text-sm text-blue-700">
      <InfoCircledIcon className="h-4 w-4" />
      <p>{message}</p>
    </div>
  );
};