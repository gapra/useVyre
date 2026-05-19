// WITH useVyre context — documented `size` token and `leftElement` prop.
import { Input } from "@usevyre/react";
import { SearchIcon } from "lucide-react";

export function SearchBox() {
  return (
    <Input
      size="md"
      leftElement={<SearchIcon />}
      placeholder="Search..."
    />
  );
}
