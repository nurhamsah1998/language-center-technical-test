import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type optionProps = { label: string; value: string };

function SelectOption({
  options = [],
  onChange = () => {},
  value,
  placeholder = "text",
}: {
  options: optionProps[];
  onChange: () => void;
  value: string | undefined;
  placeholder: string;
}) {
  return (
    <Select onValueChange={onChange} value={value}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options?.map((item: optionProps) => (
          <SelectItem key={item?.value} value={item?.value}>
            {item?.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectOption;
