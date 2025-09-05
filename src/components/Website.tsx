import { Link } from "@chakra-ui/react";
import Tooltip from "./Tooltip";

export type WebsiteProps = {
  href: string;
  label: string;
};

function Website({ href, label }: WebsiteProps) {
  return (
    <Tooltip content={href} openDelay={500}>
      <Link fontSize="sm" href={href} target="_blank">
        {label}
      </Link>
    </Tooltip>
  );
}

export default Website;
