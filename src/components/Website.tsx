import { Link, Tooltip } from "@chakra-ui/react";

export type WebsiteProps = {
  href: string;
  label: string;
};

function Website({ href, label }: WebsiteProps) {
  return (
    <Tooltip label={href} openDelay={500}>
      <Link color="blue.600" fontSize="sm" href={href} isExternal>
        {label}
      </Link>
    </Tooltip>
  );
}

export default Website;
