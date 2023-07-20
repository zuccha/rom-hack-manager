import { Flex, Text } from "@chakra-ui/react";
import Panel from "../../components/Panel";
import Section from "../../components/Section";
import Website from "../../components/Website";

function PanelAbout() {
  return (
    <Panel>
      <Section isDefaultExpanded title="Useful links">
        <Flex alignItems="flex-start" direction="column" gap={1}>
          <Website
            href="https://github.com/zuccha/rom-hack-manager"
            label="Online documentation"
          />
          <Website
            href="https://www.smwcentral.net/?p=section&s=smwhacks"
            label="Super Mario World Hacks"
          />
          <Website
            href="https://www.smwcentral.net/?p=section&s=yihacks"
            label="Yoshi Island Hacks"
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Credits">
        <Flex direction="column" gap={1} fontSize="sm">
          <Flex>
            <Text>Created by&nbsp;</Text>
            <Website href="https://zuccha.io" label="zuccha" />
          </Flex>

          <Flex>
            <Website href="https://github.com/Alcaro/Flips" label="Flips" />
            <Text>&nbsp;by Alcaro</Text>
          </Flex>

          <Flex>
            <Website
              href="https://projects.sappharad.com/multipatch/"
              label="MultiPatch"
            />
            <Text>&nbsp;by Paul Kratt</Text>
          </Flex>
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelAbout;
