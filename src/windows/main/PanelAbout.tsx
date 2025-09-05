import { Flex, Text } from "@chakra-ui/react";
import Panel from "../../components/Panel";
import Section from "../../components/Section";
import Website from "../../components/Website";

function PanelAbout() {
  return (
    <Panel>
      <Section isDefaultExpanded title="ROM Hack Manager">
        <Flex direction="column" fontSize="sm">
          <Text fontSize="sm">v2.4.0 (2024-09-07)</Text>
          <Flex>
            <Text>Created by&nbsp;</Text>
            <Website href="https://zuccha.io" label="zuccha" />
          </Flex>

          <Flex>
            <Text>Contributors:&nbsp;</Text>
            <Website href="https://github.com/robinpatzak" label="Elegist" />
            ,&nbsp;
            <Website href="https://github.com/nick-sds" label="nick-sds" />
            ,&nbsp;
            <Website href="https://github.com/spigelli" label="spigelli" />
          </Flex>
          <Website
            href="https://github.com/zuccha/rom-hack-manager/blob/main/CHANGELOG.txt"
            label="Changelog"
          />
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Additional Credits">
        <Flex direction="column" fontSize="sm">
          <Flex>
            <Text>Tools:&nbsp;</Text>
            <Website href="https://github.com/Alcaro/Flips" label="Flips" />
            <Text>&nbsp;by Alcaro,&nbsp;</Text>
            <Website
              href="https://projects.sappharad.com/multipatch/"
              label="MultiPatch"
            />
            <Text>&nbsp;by Paul Kratt</Text>
          </Flex>

          <Flex>
            <Text>API:&nbsp;</Text>
            <Website href="https://www.smwcentral.net/" label="SMW Central" />
          </Flex>
        </Flex>
      </Section>

      <Section isDefaultExpanded title="Useful links">
        <Flex alignItems="flex-start" direction="column">
          <Website
            href="https://github.com/zuccha/rom-hack-manager"
            label="Online documentation"
          />
          <Website
            href="https://www.smwcentral.net/?p=section&s=smwhacks"
            label="Super Mario World hacks"
          />
          <Website
            href="https://www.smwcentral.net/?p=section&s=yihacks"
            label="Yoshi's Island hacks"
          />
        </Flex>
      </Section>
    </Panel>
  );
}

export default PanelAbout;
