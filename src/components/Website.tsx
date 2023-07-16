import { Link } from "@chakra-ui/react";

export type WebsiteProps = {
  href: string;
  label: string;
};

function Website({ href, label }: WebsiteProps) {
  return (
    <Link color="blue.600" fontSize="sm" href={href} isExternal>
      {label}
    </Link>
  );
}

export default Website;
