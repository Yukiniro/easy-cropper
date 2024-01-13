import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputFileProps {
  id?: string;
  labelText?: string;
  accept?: string;
  multiple?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputFile(props: InputFileProps) {
  const { id = "input-file", labelText = "Picture", accept, multiple, onChange } = props;
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor={id}>{labelText}</Label>
      <Input id={id} type="file" accept={accept} multiple={multiple} onChange={onChange} />
    </div>
  );
}
