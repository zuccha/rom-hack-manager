import { Link } from "@chakra-ui/react";
import { openUrl } from "@tauri-apps/plugin-opener";
import Tooltip from "./Tooltip";

export type WebsiteProps = {
  href: string;
  label: string;
};

function Website({ href, label }: WebsiteProps) {
  return (
    <Tooltip content={href} openDelay={500}>
      <Link
        _hover={{ textDecoration: "underline" }}
        colorPalette="blue"
        fontSize="sm"
        onClick={() => openUrl(href)}
      >
        {label}
      </Link>
    </Tooltip>
  );
}

export default Website;
