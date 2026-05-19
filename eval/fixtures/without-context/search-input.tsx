// WITHOUT useVyre context — invents `icon` prop and a wrong size token.
import { Input } from "@usevyre/react";
import { SearchIcon } from "lucide-react";

export function SearchBox() {
  return (
    <Input
      size="medium"
      icon={<SearchIcon />}
      placeholder="Search..."
      style={{ borderColor: "#d1d1d6" }}
    />
  );
}
